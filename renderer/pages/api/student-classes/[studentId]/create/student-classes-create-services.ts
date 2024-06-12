import prisma from '../../../../../utils/prisma-client';
import { StudentClassCreateDto } from '../../../../../utils/types/dtos/student-classes/create';

export async function studentClassesCreateServices(
	studentId: number,
	dto: StudentClassCreateDto,
): Promise<void> {
	for (let i = 0; i < dto.length; i++) {
		await prisma.student_class.upsert({
			where: { student_id_sequence: { student_id: studentId, sequence: i } },
			update: { class_id: dto?.[i]?.class_id ?? null },
			create: { student_id: studentId, sequence: i, class_id: dto?.[i]?.class_id },
		});
	}
}
