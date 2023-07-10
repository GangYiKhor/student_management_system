import { SubjectsGetDto } from '../../../dtos/subjects/get';
import { SubjectsGetResponse } from '../../../responses/subjects/get';
import prisma from '../../../utils/prisma-client';

export async function getSubjects(getSubjectDto: SubjectsGetDto): Promise<SubjectsGetResponse> {
	const { orderBy, ...where } = getSubjectDto;

	return await prisma.subject.findMany({
		where,
		include: {
			form: true,
		},
		orderBy: {
			[orderBy?.split(' ')[0]]: orderBy?.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
		},
	});
}
