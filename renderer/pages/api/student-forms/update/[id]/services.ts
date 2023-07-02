import prisma from '../../../../../utils/prisma-client';

export async function updateForms(id: string, status: boolean) {
	const filteredId = parseInt(id);
	if (isNaN(filteredId)) {
		throw new Error('Invalid ID');
	}
	return await prisma.form.update({ where: { id: filteredId }, data: { is_active: status } });
}
