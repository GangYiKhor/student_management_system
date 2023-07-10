import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import prisma from '../../../utils/prisma-client';

export async function getForms(getFormsDto: StudentFormsGetDto) {
	const { orderBy, ...where } = getFormsDto;

	return await prisma.form.findMany({
		where,
		orderBy: {
			[orderBy?.split(' ')[0]]: orderBy?.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
		},
	});
}
