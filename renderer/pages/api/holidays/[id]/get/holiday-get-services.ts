import prisma from '../../../../../utils/prisma-client';
import { HolidaysGetResponse } from '../../../../../utils/types/responses/holidays/get';

export async function holidayGetServices(id: number): Promise<HolidaysGetResponse> {
	return prisma.holiday.findFirst({ where: { id } });
}
