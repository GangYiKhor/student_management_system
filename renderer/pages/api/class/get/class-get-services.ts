import { ClassGetDto } from '../../../../dtos/class/get';
import { ClassGetResponse } from '../../../../responses/class/get';
import prisma from '../../../../utils/prisma-client';

export async function classGetServices(getClassDto: ClassGetDto): Promise<ClassGetResponse[]> {
	const { orderBy: order, ...where } = getClassDto;

	let orderBy: { [key: string]: string } | { [key: string]: { [key: string]: string } } = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};
	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
	} else if (order.split(' ')[0] === 'teacher_name') {
		orderBy = { teacher: orderBy };
	}

	const results = await prisma.class_registration.findMany({
		include: { form: true, teacher: true },
		where,
		orderBy,
	});

	return results;
}
