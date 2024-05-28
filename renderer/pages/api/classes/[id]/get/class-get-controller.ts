import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ClassesGetResponse } from '../../../../../utils/types/responses/classes/get';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { classGetServices } from './class-get-services';

export async function classGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<ClassesGetResponse | ErrorResponse>,
) {
	devLog('Get Single Class Handler', req.query);

	try {
		const result = await classGetServices(parseInt(req.query.id));
		devLog('Get Single Class Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Class Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
