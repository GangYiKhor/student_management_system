import prisma from '../../../utils/prisma-client';

export async function getForms() {
	return await prisma.form.findMany({
		orderBy: {
			form_name: 'asc',
		},
	});
}
