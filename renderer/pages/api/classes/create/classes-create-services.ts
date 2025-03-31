import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { ClassCreateDto } from '../../../../utils/types/dtos/classes/create';
import { ClassesCreateResponse } from '../../../../utils/types/responses/classes/create';

export async function classesCreateServices(dto: ClassCreateDto): Promise<ClassesCreateResponse> {
	const { teacher_id, start_date, end_date, day, start_time, end_time } = dto;
	const existingRecord = await prisma.class_registration.findFirst({
		where: {
			teacher_id,
			start_date: { lte: end_date ?? undefined },
			OR: [{ end_date: { gte: start_date ?? undefined } }, { end_date: null }],
			day,
			start_time: { lt: end_time ?? undefined },
			end_time: { gt: start_time ?? undefined },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Class With ID: ' + existingRecord.id, 'Clashed Class!');
	}

	const result = await prisma.class_registration.create({ data: dto });
	return { id: result.id };
}
