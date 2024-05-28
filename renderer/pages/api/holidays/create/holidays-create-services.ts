import prisma from '../../../../utils/prisma-client';
import { HolidayCreateDto } from '../../../../utils/types/dtos/holidays/create';

export async function holidaysCreateServices(createHolidayDto: HolidayCreateDto): Promise<void> {
	await prisma.holiday.create({ data: createHolidayDto });
}
