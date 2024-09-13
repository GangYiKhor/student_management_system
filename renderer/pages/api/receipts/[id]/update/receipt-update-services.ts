import prisma from '../../../../../utils/prisma-client';
import { ReceiptUpdateDto } from '../../../../../utils/types/dtos/receipts/update';
import { ReceiptUpdateResponse } from '../../../../../utils/types/responses/receipts/update';

export async function receiptUpdateServices(
	id: number,
	dto: ReceiptUpdateDto,
): Promise<ReceiptUpdateResponse> {
	await prisma.receipt.update({ where: { id }, data: dto });

	const receipt = await prisma.receipt.findFirst({
		include: { receipt_class: true },
		where: { id },
	});
	receipt?.receipt_class.sort((a, b) => a.sequence - b.sequence);
	return receipt;
}
