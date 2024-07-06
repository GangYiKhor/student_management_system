import prisma from '../../../../../utils/prisma-client';
import { VoucherUpdateDto } from '../../../../../utils/types/dtos/vouchers/update';

export async function voucherUpdateServices(id: string, dto: VoucherUpdateDto): Promise<void> {
	await prisma.voucher.update({ where: { id }, data: dto });
}
