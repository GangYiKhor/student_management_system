import prisma from '../../../../../utils/prisma-client';
import { TeachersGetResponse } from '../../../../../utils/types/responses/teachers/get';

export async function getTeacherServices(id: number): Promise<TeachersGetResponse> {
	return prisma.teacher.findUnique({ where: { id } });
}
