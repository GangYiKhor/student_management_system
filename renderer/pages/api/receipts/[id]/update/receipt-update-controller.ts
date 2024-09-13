import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ReceiptUpdateDto } from '../../../../../utils/types/dtos/receipts/update';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { ReceiptUpdateResponse } from '../../../../../utils/types/responses/receipts/update';
import { receiptUpdateServices } from './receipt-update-services';

export async function receiptUpdateController(
	req: ExtendedNextApiRequest<ReceiptUpdateDto, { id: string }>,
	res: NextApiResponse<ReceiptUpdateResponse | ErrorResponse>,
) {
	devLog('Update Receipt Handler', req.query, req.body);

	try {
		const result = await receiptUpdateServices(parseInt(req.query.id), req.body);
		devLog('Update Receipt Handler: UPDATED');
		res.status(200).json(result);
	} catch (err) {
		devLog('Update Receipt Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
