import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentFormCreateDto } from '../../../../utils/types/dtos/student-forms/create';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { StudentFormsCreateResponse } from '../../../../utils/types/responses/student-forms/create';
import { formsCreateServices } from './forms-create-services';

export async function formsCreateController(
	req: ExtendedNextApiRequest<StudentFormCreateDto>,
	res: NextApiResponse<StudentFormsCreateResponse | ErrorResponse>,
) {
	devLog('Create Student Forms Handler', req.body);

	try {
		const result = await formsCreateServices(req.body);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Student Forms Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
