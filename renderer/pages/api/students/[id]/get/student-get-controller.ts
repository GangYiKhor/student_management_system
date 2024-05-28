import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { StudentsGetResponse } from '../../../../../utils/types/responses/students/get';
import { studentGetServices } from './student-get-services';

export async function studentGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<StudentsGetResponse | ErrorResponse>,
) {
	devLog('Get Single Student Handler', req.query);

	try {
		const result = await studentGetServices(parseInt(req.query.id));
		devLog('Get Single Student Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Student Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
