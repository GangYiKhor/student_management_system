import prisma from '../../../../../utils/prisma-client';
import { StudentClassesGetResponses } from '../../../../../utils/types/responses/student-classes/get';

export async function studentClassesGetServices(
	studentId: number,
): Promise<StudentClassesGetResponses> {
	return prisma.student_class.findMany({
		include: { class: { include: { teacher: true, form: true } } },
		where: { student_id: studentId },
		orderBy: { sequence: 'asc' },
	});
}
