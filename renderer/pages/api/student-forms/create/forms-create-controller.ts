import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentFormCreateDto } from '../../../../utils/types/dtos/student-forms/create';
import { formsCreateServices } from './forms-create-services';

export async function formsCreateController(
	req: ExtendedNextApiRequest<StudentFormCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Student Forms Handler', req.body);

	try {
		await formsCreateServices(req.body);
		res.status(201).end();
	} catch (err: any) {
		devLog('Create Student Forms Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
