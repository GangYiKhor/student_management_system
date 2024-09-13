import prisma from '../../../../../utils/prisma-client';
import { ReceiptsGetResponse } from '../../../../../utils/types/responses/receipts/get';

export async function receiptGetServices(id: number): Promise<ReceiptsGetResponse> {
	const receipt = await prisma.receipt.findFirst({
		include: { receipt_class: true },
		where: { id },
	});
	receipt?.receipt_class.sort((a, b) => a.sequence - b.sequence);
	return receipt;
}
