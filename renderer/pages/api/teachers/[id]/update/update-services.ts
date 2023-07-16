import { TeachersUpdateDto } from '../../../../../dtos/teachers/update';
import { TeachersUpdateResponse } from '../../../../../responses/teachers/update';
import prisma from '../../../../../utils/prisma-client';

export async function updateTeachersServices(
	id: number,
	updateTeachersDto: TeachersUpdateDto,
): Promise<TeachersUpdateResponse> {
	return await prisma.teacher.update({ where: { id }, data: updateTeachersDto });
}
