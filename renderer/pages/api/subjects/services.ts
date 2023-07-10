import { SubjectsGetDto } from '../../../dtos/subjects/get';
import { SubjectsGetResponse } from '../../../responses/subjects/get';
import prisma from '../../../utils/prisma-client';

export async function getSubjects(getSubjectDto: SubjectsGetDto): Promise<SubjectsGetResponse> {
	return await prisma.subject.findMany({
		where: getSubjectDto,
		include: {
			form: true,
		},
	});
}
