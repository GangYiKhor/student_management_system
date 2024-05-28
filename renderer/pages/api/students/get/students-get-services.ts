import { parseDateOrUndefined, parseIntOrUndefined } from '../../../../utils/parsers';
import prisma from '../../../../utils/prisma-client';
import { StudentsGetDto, StudentsGetQueryDto } from '../../../../utils/types/dtos/students/get';
import { OrderBy } from '../../../../utils/types/orderBy';
import { StudentsGetResponses } from '../../../../utils/types/responses/students/get';

export async function studentsGetServices(
	getStudentsDto: StudentsGetDto & { OR?: { [key: string]: any } },
): Promise<StudentsGetResponses> {
	const { search_text, reg_date_start, reg_date_end, orderBy: order, ...where } = getStudentsDto;

	if (reg_date_start && reg_date_end) {
		where.reg_date = { gte: reg_date_start, lte: reg_date_end };
	} else if (reg_date_start) {
		where.reg_date = { gte: reg_date_start };
	} else if (reg_date_end) {
		where.reg_date = { lte: reg_date_end };
	}

	let orderBy: OrderBy = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};

	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
	}

	return prisma.student.findMany({
		include: { form: true },
		where: {
			...where,
			OR: [
				{ student_name: { contains: search_text } },
				{ ic: { contains: search_text } },
				{ school: { contains: search_text } },
				{ phone_number: { contains: search_text } },
				{ parent_phone_number: { contains: search_text } },
				{ email: { contains: search_text } },
				{ address: { contains: search_text } },
			],
		},
		orderBy,
	});
}

export function studentsGetParseDto(query: StudentsGetQueryDto): StudentsGetDto {
	return {
		search_text: query.search_text,
		form_id: parseIntOrUndefined(query.form_id),
		reg_date_start: parseDateOrUndefined(query.reg_date_start),
		reg_date_end: parseDateOrUndefined(query.reg_date_end),
		reg_year: parseIntOrUndefined(query.reg_year),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
