import prisma from '../../../../../utils/prisma-client';
import { StudentFormUpdateDto } from '../../../../../utils/types/dtos/student-forms/update';

export async function studentFormUpdateServices(
	id: number,
	dto: StudentFormUpdateDto,
): Promise<void> {
	await prisma.form.update({ where: { id }, data: dto });
}
