import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentCreateDto } from '../../../../utils/types/dtos/students/create';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { StudentCreateResponse } from '../../../../utils/types/responses/students/create';
import { studentsCreateServices } from './students-create-services';

export async function studentsCreateController(
	req: ExtendedNextApiRequest<StudentCreateDto>,
	res: NextApiResponse<StudentCreateResponse | ErrorResponse>,
) {
	devLog('Create Student Handler', req.body);

	try {
		const result = await studentsCreateServices(req.body);

		devLog('Create Student Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Student Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
