import { TeachersGetDto } from '../../../../dtos/teachers/get';
import { TeachersGetResponse } from '../../../../responses/teachers/get';
import prisma from '../../../../utils/prisma-client';

export async function getTeachersServices(
	getTeachersDto: TeachersGetDto,
): Promise<TeachersGetResponse> {
	const { orderBy: order, ...where } = getTeachersDto;

	let orderBy = { [order.split(' ')[0]]: order.split(' ')[1] !== 'desc' ? 'asc' : 'desc' };

	return await prisma.teacher.findMany({ where, orderBy });
}
