import { SubjectsCreateDto } from '../../../../dtos/subjects/create';
import { SubjectsCreateResponse } from '../../../../responses/subjects/create';
import prisma from '../../../../utils/prisma-client';

export async function createSubjects(subject: SubjectsCreateDto): Promise<SubjectsCreateResponse> {
	return await prisma.subject.create({ data: subject });
}
