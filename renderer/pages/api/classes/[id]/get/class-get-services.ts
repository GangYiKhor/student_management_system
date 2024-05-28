import prisma from '../../../../../utils/prisma-client';
import { ClassesGetResponse } from '../../../../../utils/types/responses/classes/get';

export async function classGetServices(id: number): Promise<ClassesGetResponse> {
	return prisma.class_registration.findFirst({
		include: { form: true, teacher: true },
		where: { id },
	});
}
