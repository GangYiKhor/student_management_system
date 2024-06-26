import { getToday } from '../../../../utils/dateOperations';
import prisma from '../../../../utils/prisma-client';
import { TeacherCreateDto } from '../../../../utils/types/dtos/teachers/create';

export async function createTeachersServices(dto: TeacherCreateDto): Promise<void> {
	await prisma.teacher.create({
		data: { ...dto, start_date: getToday(), is_active: true },
	});
}
