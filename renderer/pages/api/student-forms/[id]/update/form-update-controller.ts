import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { StudentFormUpdateDto } from '../../../../../utils/types/dtos/student-forms/update';
import { studentFormUpdateServices } from './form-update-services';

export async function studentFormUpdateController(
	req: ExtendedNextApiRequest<StudentFormUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Student Form Handler', req.query);

	try {
		const result = await studentFormUpdateServices(parseInt(req.query.id), req.body);

		devLog('Update Student Form Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Update Student Form Handler: ERROR', err);
		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
