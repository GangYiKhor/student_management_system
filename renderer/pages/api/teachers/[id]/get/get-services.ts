import { TeachersGetSingleResponse } from '../../../../../responses/teachers/get-single';
import prisma from '../../../../../utils/prisma-client';

export async function getSingleTeachersServices(id: number): Promise<TeachersGetSingleResponse> {
	return await prisma.teacher.findUnique({ where: { id } });
}
