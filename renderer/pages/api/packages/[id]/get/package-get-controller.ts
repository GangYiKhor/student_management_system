import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { PackagesGetResponse } from '../../../../../utils/types/responses/packages/get';
import { packageGetServices } from './package-get-services';

export async function packageGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<PackagesGetResponse | ErrorResponse>,
) {
	devLog('Get Single Package Handler', req.query);

	try {
		const result = await packageGetServices(parseInt(req.query.id));

		devLog('Get Single Package Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Package Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
