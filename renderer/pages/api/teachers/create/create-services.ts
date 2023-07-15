import { TeachersCreateDto } from '../../../../dtos/teachers/create';
import { TeachersCreateResponse } from '../../../../responses/teachers/create';
import prisma from '../../../../utils/prisma-client';

export async function createTeachersServices(
	getTeachersDto: TeachersCreateDto,
): Promise<TeachersCreateResponse> {
	return await prisma.teacher.create({
		data: { ...getTeachersDto, start_date: new Date(), is_active: true },
	});
}
