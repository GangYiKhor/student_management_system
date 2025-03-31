import prisma from '../../../../utils/prisma-client';
import { HolidayCreateDto } from '../../../../utils/types/dtos/holidays/create';
import { HolidaysCreateResponse } from '../../../../utils/types/responses/holidays/create';

export async function holidaysCreateServices(
	dto: HolidayCreateDto,
): Promise<HolidaysCreateResponse> {
	const result = await prisma.holiday.create({ data: dto });
	return { id: result.id };
}
