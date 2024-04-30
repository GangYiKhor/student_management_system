import { ClassGetResponse } from '../../../../../responses/class/get';
import prisma from '../../../../../utils/prisma-client';

export async function classGetSingleServices(id: number): Promise<ClassGetResponse> {
	const result = await prisma.class_registration.findFirst({
		include: { form: true, teacher: true },
		where: { id },
	});
	return result;
}
