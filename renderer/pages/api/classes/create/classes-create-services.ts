import { ExistedError } from '../../../../utils/errors/ExistedError';
import prisma from '../../../../utils/prisma-client';
import { ClassCreateDto } from '../../../../utils/types/dtos/classes/create';

export async function classesCreateServices(dto: ClassCreateDto): Promise<void> {
	const { teacher_id, start_date, end_date, day, start_time, end_time } = dto;
	const existingRecord = await prisma.class_registration.findFirst({
		where: {
			teacher_id,
			start_date: { lte: end_date ?? undefined },
			end_date: { gte: start_date ?? undefined },
			day,
			start_time: { lt: end_time ?? undefined },
			end_time: { gt: start_time ?? undefined },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Class With ID: ' + existingRecord.id, 'Clashed Class!');
	}

	await prisma.class_registration.create({ data: dto });
}
