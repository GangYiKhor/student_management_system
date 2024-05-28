import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { TaxesGetResponse } from '../../../../../utils/types/responses/taxes/get';
import { taxGetServices } from './tax-get-services';

export async function taxGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<TaxesGetResponse | ErrorResponse>,
) {
	devLog('Get Single Tax Handler', req.query);

	try {
		const result = await taxGetServices(parseInt(req.query.id));

		devLog('Get Single Tax Handler: Responding', result);

		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Tax Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
