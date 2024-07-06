import prisma from '../../../../../utils/prisma-client';
import { HolidayUpdateDto } from '../../../../../utils/types/dtos/holidays/update';

export async function holidayUpdateServices(id: number, dto: HolidayUpdateDto): Promise<void> {
	await prisma.holiday.update({ where: { id }, data: dto });
}
