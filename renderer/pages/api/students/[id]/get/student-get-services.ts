import prisma from '../../../../../utils/prisma-client';
import { StudentsGetResponse } from '../../../../../utils/types/responses/students/get';

export async function studentGetServices(id: number): Promise<StudentsGetResponse> {
	return prisma.student.findFirst({
		include: { form: true },
		where: { id },
	});
}
