import { readConfig } from '../../../../utils/configs';
import { isSameDayOrBefore } from '../../../../utils/dateOperations';
import { NotFoundError } from '../../../../utils/errors/NotFoundError';
import prisma from '../../../../utils/prisma-client';
import { ReceiptCreateDto } from '../../../../utils/types/dtos/receipts/create';
import { ReceiptCreateResponse } from '../../../../utils/types/responses/receipts/create';
import { receiptGenerateServices } from '../../receipt-generate/create/receipt-generate-create-services';
import { voucherGetServices } from '../../vouchers/[id]/get/voucher-get-services';
import { voucherUpdateServices } from '../../vouchers/[id]/update/voucher-update-services';

export async function receiptsCreateServices(
	dto: ReceiptCreateDto,
): Promise<ReceiptCreateResponse> {
	const latestId =
		(await prisma.receipt.findFirst({ select: { id: true }, orderBy: { id: 'desc' } }))?.id ?? 0;
	const receiptPrefix = readConfig('RECEIPT_PREFIX');
	const id = latestId + 1;
	const receipt_no = `${receiptPrefix}-${latestId + 1}`;

	const { receipt_class: generatedClass, ...generatedData } = await receiptGenerateServices(dto);
	const receiptClass = generatedClass.map((value, index) => ({
		...value,
		receipt_id: id,
		sequence: index,
	}));
	const receiptData = { ...generatedData, id, receipt_no };

	let updatedVoucher = false;
	if (receiptData?.voucher_id) {
		const voucher = await voucherGetServices(receiptData.voucher_id);
		if (voucher?.used) {
			throw new NotFoundError('The voucher has been used!', 'Invalid Voucher');
		} else if (!isSameDayOrBefore(new Date(), voucher?.expired_at)) {
			throw new NotFoundError('The voucher is expired!', 'Invalid Voucher');
		} else if (voucher?.student !== null && voucher?.student?.id !== receiptData?.student_id) {
			throw new NotFoundError(
				`The voucher is not usable by ${receiptData.student_name}`,
				'Invalid Voucher',
			);
		} else if (voucher?.student?.id === receiptData?.student_id) {
			await voucherUpdateServices(receiptData.voucher_id, { used: true });
			updatedVoucher = true;
		}
	}

	await prisma.$transaction([
		prisma.receipt.create({ data: { ...receiptData, status: 'Received' } }),
		prisma.receipt_class.createMany({ data: receiptClass }),
	]);

	try {
		return await prisma.receipt.findFirstOrThrow({
			include: { receipt_class: true },
			where: { id },
		});
	} catch (err) {
		if (updatedVoucher) {
			await voucherUpdateServices(receiptData.voucher_id, { used: false });
		}
		throw err;
	}
}
