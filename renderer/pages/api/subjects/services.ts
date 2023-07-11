import { SubjectsGetDto } from '../../../dtos/subjects/get';
import { SubjectsGetResponse } from '../../../responses/subjects/get';
import prisma from '../../../utils/prisma-client';

export async function getSubjects(getSubjectDto: SubjectsGetDto): Promise<SubjectsGetResponse> {
	const { orderBy: order, ...where } = getSubjectDto;

	let orderBy: object = undefined;
	if (order) {
		if (order.includes('form_name')) {
			orderBy = { form: { form_name: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' } };
		} else {
			orderBy = { [order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' };
		}
	}

	return await prisma.subject.findMany({ where, include: { form: true }, orderBy });
}
