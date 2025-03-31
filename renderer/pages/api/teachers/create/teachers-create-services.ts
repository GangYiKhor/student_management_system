import { getToday } from '../../../../utils/dateOperations';
import prisma from '../../../../utils/prisma-client';
import { TeacherCreateDto } from '../../../../utils/types/dtos/teachers/create';
import { TeachersCreateResponse } from '../../../../utils/types/responses/teachers/create';

export async function createTeachersServices(
	dto: TeacherCreateDto,
): Promise<TeachersCreateResponse> {
	const result = await prisma.teacher.create({
		data: { ...dto, start_date: getToday(), is_active: true },
	});
	return { id: result.id };
}
