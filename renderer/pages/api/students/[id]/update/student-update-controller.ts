import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { StudentUpdateDto } from '../../../../../utils/types/dtos/students/update';
import { studentUpdateServices } from './student-update-services';

export async function studentUpdateController(
	req: ExtendedNextApiRequest<StudentUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Student Handler', req.query);

	try {
		const result = await studentUpdateServices(parseInt(req.query.id), req.body);
		devLog('Update Student Handler: UPDATED');
		res.status(200).json(result);
	} catch (err) {
		devLog('Update Student Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
