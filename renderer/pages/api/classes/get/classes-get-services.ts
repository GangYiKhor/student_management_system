import {
	parseDateOrUndefined,
	parseFloatOrUndefined,
	parseIntOrUndefined,
} from '../../../../utils/parsers';
import prisma from '../../../../utils/prisma-client';
import { ClassesGetDto, ClassesGetQueryDto } from '../../../../utils/types/dtos/classes/get';
import { OrderBy } from '../../../../utils/types/orderBy';
import { ClassesGetResponses } from '../../../../utils/types/responses/classes/get';

export async function classesGetServices(
	getClassDto: ClassesGetDto & { OR?: { [key: string]: any }[] },
): Promise<ClassesGetResponses> {
	const { orderBy: order, is_active, ...where } = getClassDto;

	if (is_active) {
		const now = new Date();
		where.start_date = { lte: now };
		where.end_date = { gte: now };
	} else if (is_active === false) {
		const now = new Date();
		where.OR = [{ start_date: { gte: now } }, { end_date: { lte: now } }];
	}

	let orderBy: OrderBy = {
		[order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc',
	};

	if (order.split(' ')[0] === 'form_name') {
		orderBy = { form: orderBy };
	} else if (order.split(' ')[0] === 'teacher_name') {
		orderBy = { teacher: orderBy };
	}

	return prisma.class_registration.findMany({
		include: { form: true, teacher: true },
		where,
		orderBy,
	});
}

export function classGetParseDto(query: ClassesGetQueryDto): ClassesGetDto {
	return {
		teacher_id: parseIntOrUndefined(query.teacher_id),
		start_date: parseDateOrUndefined(query.start_date),
		end_date: parseDateOrUndefined(query.end_date),
		class_year: parseIntOrUndefined(query.class_year),
		form_id: parseIntOrUndefined(query.form_id),
		day: parseIntOrUndefined(query.day),
		start_time: parseDateOrUndefined(query.start_time),
		end_time: parseDateOrUndefined(query.end_time),
		fees: parseFloatOrUndefined(query.fees),
		is_package: query.is_package ? query.is_package === 'true' : undefined,
		class_name: query.class_name,
		is_active: query.is_active ? query.is_active === 'true' : undefined,
		orderBy: query.orderBy,
	};
}
