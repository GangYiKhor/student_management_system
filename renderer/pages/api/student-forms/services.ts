import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import prisma from '../../../utils/prisma-client';

export async function getForms(getFormsDto: StudentFormsGetDto) {
	return await prisma.form.findMany({
		where: {
			is_active: getFormsDto.is_active,
		},
		orderBy: {
			form_name: 'asc',
		},
	});
}
