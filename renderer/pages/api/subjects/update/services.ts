import { SubjectsUpdateDto } from '../../../../dtos/subjects/update';
import { SubjectsUpdateResponse } from '../../../../responses/subjects/update';
import prisma from '../../../../utils/prisma-client';

export async function updateSubjects(subject: SubjectsUpdateDto): Promise<SubjectsUpdateResponse> {
	const { id, ...data } = subject;

	return await prisma.subject.update({ data, where: { id } });
}
