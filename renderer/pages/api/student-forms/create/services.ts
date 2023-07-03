import prisma from '../../../../utils/prisma-client';

export async function createForms(formName: string) {
	const existCount = await prisma.form.count({ where: { form_name: formName } });
	if (existCount > 0) {
		throw new Error('Duplicates Found!');
	}

	return await prisma.form.create({ data: { form_name: formName, is_active: true } });
}
