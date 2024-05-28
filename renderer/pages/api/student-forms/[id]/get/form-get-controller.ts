import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { StudentFormsGetResponse } from '../../../../../utils/types/responses/student-forms/get';
import { studentFormGetServices } from './form-get-services';

export async function studentFormGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<StudentFormsGetResponse | ErrorResponse>,
) {
	devLog('Get Single Student Form Handler', req.query);

	try {
		const result = await studentFormGetServices(parseInt(req.query.id));

		devLog('Get Single Student Form: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Student Form: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
