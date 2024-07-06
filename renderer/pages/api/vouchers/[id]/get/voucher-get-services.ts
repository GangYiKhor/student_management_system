import prisma from '../../../../../utils/prisma-client';
import { VouchersGetResponse } from '../../../../../utils/types/responses/vouchers/get';

export async function voucherGetServices(id: string): Promise<VouchersGetResponse> {
	return prisma.voucher.findFirst({
		include: { student: true },
		where: { id },
	});
}
