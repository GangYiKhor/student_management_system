import { ExistedError } from '../../../../../utils/errors/ExistedError';
import prisma from '../../../../../utils/prisma-client';
import { ClassUpdateDto } from '../../../../../utils/types/dtos/classes/update';

export async function classUpdateServices(
	id: number,
	updateClassDto: ClassUpdateDto,
): Promise<void> {
	const { teacher_id, start_date, end_date, day, start_time, end_time } = updateClassDto;
	const existingRecord = await prisma.class_registration.findFirst({
		where: {
			teacher_id,
			start_date: { lte: end_date },
			end_date: { gte: start_date },
			day,
			start_time: { lte: end_time },
			end_time: { gte: start_time },
			NOT: { id },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Class With ID: ' + existingRecord.id.toString());
	}

	await prisma.class_registration.update({ where: { id }, data: updateClassDto });
}
