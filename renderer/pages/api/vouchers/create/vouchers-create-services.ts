import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { VoucherCreateDto } from '../../../../utils/types/dtos/vouchers/create';

export async function vouchersCreateServices(dto: VoucherCreateDto): Promise<void> {
	const { id } = dto;
	const existingRecord = await prisma.voucher.findFirst({
		where: { id },
	});

	if (existingRecord) {
		throw new ExistedError('Voucher ID Used', 'Duplicate Voucher ID!');
	}

	await prisma.voucher.create({ data: dto });
}
