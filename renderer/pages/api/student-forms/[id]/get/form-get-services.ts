import prisma from '../../../../../utils/prisma-client';
import { StudentFormsGetResponse } from '../../../../../utils/types/responses/student-forms/get';

export async function studentFormGetServices(id: number): Promise<StudentFormsGetResponse> {
	return prisma.form.findFirst({ where: { id } });
}
