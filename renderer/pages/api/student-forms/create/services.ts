import prisma from '../../../../utils/prisma-client';

export async function createForms(formName: string) {
	return await prisma.form.create({ data: { form_name: formName, is_active: true } });
}
