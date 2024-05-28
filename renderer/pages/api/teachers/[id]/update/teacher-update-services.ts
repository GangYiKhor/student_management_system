import prisma from '../../../../../utils/prisma-client';
import { TeacherUpdateDto } from '../../../../../utils/types/dtos/teachers/update';

export async function updateTeachersServices(id: number, dto: TeacherUpdateDto): Promise<void> {
	await prisma.teacher.update({ where: { id }, data: dto });
}
