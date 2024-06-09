import { parseDateTime } from '../../../../utils/dateOperations';
import { tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { StudentsGetDto, StudentsGetQueryDto } from '../../../../utils/types/dtos/students/get';
import { StudentsGetResponses } from '../../../../utils/types/responses/students/get';

export async function studentsGetServices(
	dto: StudentsGetDto & { OR?: { [key: string]: any } },
): Promise<StudentsGetResponses> {
	const { search_text, reg_date_start, reg_date_end, orderBy: order, ...where } = dto;

	if (reg_date_start && reg_date_end) {
		where.reg_date = { gte: reg_date_start, lte: reg_date_end };
	} else if (reg_date_start) {
		where.reg_date = { gte: reg_date_start };
	} else if (reg_date_end) {
		where.reg_date = { lte: reg_date_end };
	}

	const orderBy = parseOrderBy(order, { student_name: 'asc' }, [
		{ columnName: 'form_name', tableName: 'form' },
	]);

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
		form_id: tryParseInt(query.form_id),
		reg_date_start: parseDateTime(query.reg_date_start),
		reg_date_end: parseDateTime(query.reg_date_end),
		reg_year: tryParseInt(query.reg_year),
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
