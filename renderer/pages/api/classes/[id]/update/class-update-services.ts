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
			start_date: { lte: end_date ?? undefined },
			end_date: { gte: start_date ?? undefined },
			day,
			start_time: { lt: end_time ?? undefined },
			end_time: { gt: start_time ?? undefined },
			NOT: { id },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Class With ID: ' + existingRecord.id.toString());
	}

	await prisma.class_registration.update({ where: { id }, data: updateClassDto });
}
