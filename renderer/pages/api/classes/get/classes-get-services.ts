import { getUTCToday, parseDateTime } from '../../../../utils/dateOperations';
import { tryParseFloat, tryParseInt } from '../../../../utils/numberParsers';
import { parseOrderBy } from '../../../../utils/parseOrderBy';
import prisma from '../../../../utils/prisma-client';
import { ClassesGetDto, ClassesGetQueryDto } from '../../../../utils/types/dtos/classes/get';
import { ClassesGetResponses } from '../../../../utils/types/responses/classes/get';

export async function classesGetServices(
	dto: ClassesGetDto & { OR?: { [key: string]: any }[] },
): Promise<ClassesGetResponses> {
	const { orderBy: order, is_active, ...where } = dto;

	const today = getUTCToday();
	const tomorrow = getUTCToday();
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (is_active) {
		where.start_date = { lt: tomorrow };
		where.OR = [{ end_date: { gte: today } }, { end_date: null }];
	} else if (is_active === false) {
		where.OR = [{ start_date: { gte: tomorrow } }, { end_date: { lt: today } }];
	}

	const orderBy = parseOrderBy(order, { form: { form_name: 'asc' } }, [
		{ columnName: 'form_name', tableName: 'form' },
		{ columnName: 'teacher_name', tableName: 'teacher' },
	]);

	return prisma.class_registration.findMany({
		include: { form: true, teacher: true },
		where,
		orderBy,
	});
}

export function classGetParseDto(query: ClassesGetQueryDto): ClassesGetDto {
	return {
		teacher_id: tryParseInt(query.teacher_id),
		start_date: parseDateTime(query.start_date),
		end_date: parseDateTime(query.end_date),
		class_year: tryParseInt(query.class_year),
		form_id: tryParseInt(query.form_id),
		day: tryParseInt(query.day),
		start_time: parseDateTime(query.start_time),
		end_time: parseDateTime(query.end_time),
		fees: tryParseFloat(query.fees),
		is_package: query.is_package ? query.is_package === 'true' : undefined,
		class_name: query.class_name,
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
