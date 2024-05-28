import prisma from '../../../../../utils/prisma-client';
import { StudentsUpdateDto } from '../../../../../utils/types/dtos/students/update';

export async function studentUpdateServices(
	id: number,
	updateStudentDto: StudentsUpdateDto,
): Promise<void> {
	await prisma.student.update({ where: { id }, data: updateStudentDto });
}
