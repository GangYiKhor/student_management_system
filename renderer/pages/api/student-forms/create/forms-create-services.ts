import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { StudentFormCreateDto } from '../../../../utils/types/dtos/student-forms/create';
import { StudentFormsCreateResponse } from '../../../../utils/types/responses/student-forms/create';

export async function formsCreateServices(
	dto: StudentFormCreateDto,
): Promise<StudentFormsCreateResponse> {
	const existingRecord = await prisma.form.findFirst({
		where: dto,
	});

	if (existingRecord) {
		throw new ExistedError(
			'Duplicated Student Forms: ' + existingRecord.id,
			'Duplicate Student Forms!',
		);
	}

	const result = await prisma.form.create({ data: { ...dto, is_active: true } });
	return { id: result.id };
}
