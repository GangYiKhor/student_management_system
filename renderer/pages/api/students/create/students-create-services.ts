import prisma from '../../../../utils/prisma-client';
import { StudentCreateDto } from '../../../../utils/types/dtos/students/create';
import { StudentCreateResponse } from '../../../../utils/types/responses/students/create';

export async function studentsCreateServices(
	dto: StudentCreateDto,
): Promise<StudentCreateResponse> {
	const { id } = await prisma.student.create({ data: dto });
	return { student_id: id };
}
