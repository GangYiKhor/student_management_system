import prisma from '../../../../../utils/prisma-client';
import { StudentClassCreateDto } from '../../../../../utils/types/dtos/student-classes/create';

export async function studentClassesCreateServices(
	studentId: number,
	createDto: StudentClassCreateDto,
): Promise<void> {
	for (let i = 0; i < createDto.length; i++) {
		try {
			await prisma.student_class.update({
				data: { class_id: createDto[i].class_id },
				where: { student_id_sequence: { student_id: studentId, sequence: i } },
			});
		} catch (err) {
			if (err.code === 'P2025') {
				await prisma.student_class.create({
					data: { student_id: studentId, sequence: i, class_id: createDto[i].class_id },
				});
			}
		}
	}
}
