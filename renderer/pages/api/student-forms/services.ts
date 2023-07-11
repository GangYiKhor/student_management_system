import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import prisma from '../../../utils/prisma-client';

export async function getForms(getFormsDto: StudentFormsGetDto) {
	const { orderBy: order, ...where } = getFormsDto;

	let orderBy: object = undefined;
	if (order) {
		orderBy = { [order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' };
	} else {
		orderBy = { form_name: 'asc' };
	}

	return await prisma.form.findMany({ where, orderBy });
}
