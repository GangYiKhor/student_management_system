import prisma from '../../../../../utils/prisma-client';
import { StudentUpdateDto } from '../../../../../utils/types/dtos/students/update';
import { StudentUpdateResponse } from '../../../../../utils/types/responses/students/update';

export async function studentUpdateServices(
	id: number,
	dto: StudentUpdateDto,
): Promise<StudentUpdateResponse> {
	const { id: student_id } = await prisma.student.update({ where: { id }, data: dto });
	return { student_id };
}
