import prisma from '../../../../../utils/prisma-client';
import { StudentUpdateDto } from '../../../../../utils/types/dtos/students/update';

export async function studentUpdateServices(id: number, dto: StudentUpdateDto): Promise<void> {
	await prisma.student.update({ where: { id }, data: dto });
}
