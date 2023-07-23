import { ClassCreateDto } from '../../../../dtos/class/create';
import { ExistedError } from '../../../../utils/ExistedError';
import prisma from '../../../../utils/prisma-client';

export async function classCreateServices(createClassDto: ClassCreateDto): Promise<void> {
	const { teacher_id, start_date, end_date, day, start_time, end_time } = createClassDto;
	const existingRecord = await prisma.class_registration.findFirst({
		where: {
			teacher_id,
			start_date: { lte: end_date },
			end_date: { gte: start_date },
			day,
			start_time: { lte: end_time },
			end_time: { gte: start_time },
		},
	});

	if (existingRecord) {
		throw new ExistedError('Clashed Class With ID: ' + existingRecord.id.toString());
	}
	await prisma.class_registration.create({ data: createClassDto });
}
