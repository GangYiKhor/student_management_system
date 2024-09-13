import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { ReceiptsGetResponse } from '../../../../../utils/types/responses/receipts/get';
import { receiptGetServices } from './receipt-get-services';

export async function receiptGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<ReceiptsGetResponse | ErrorResponse>,
) {
	devLog('Get Single Receipt Handler', req.query);

	try {
		const result = await receiptGetServices(parseInt(req.query.id));
		devLog('Get Single Receipt Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Receipt Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
