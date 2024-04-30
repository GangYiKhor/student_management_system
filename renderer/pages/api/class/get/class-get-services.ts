import { ClassGetDto } from '../../../../dtos/class/get';
import { ClassGetResponse } from '../../../../responses/class/get';
import prisma from '../../../../utils/prisma-client';

export async function classGetServices(
	getClassDto: ClassGetDto & { OR: {} },
): Promise<ClassGetResponse[]> {
	const { orderBy: order, is_active, ...where } = getClassDto;

	if (is_active) {
		const now = new Date();
		where.start_date = { lte: now };
		where.end_date = { gte: now };
	} else if (is_active === false) {
		const now = new Date();
		where.OR = {
			start_date: { gte: now },
			end_date: { lte: now },
		};
	}

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
