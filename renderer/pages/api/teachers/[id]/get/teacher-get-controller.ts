import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { TeachersGetResponse } from '../../../../../utils/types/responses/teachers/get';
import { getTeacherServices } from './teacher-get-services';

export async function getTeacherController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<TeachersGetResponse | ErrorResponse>,
) {
	devLog('Get Teacher Handler', req.query);

	try {
		const result = await getTeacherServices(parseInt(req.query.id));
		devLog('Get Single Teacher Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Teacher Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
