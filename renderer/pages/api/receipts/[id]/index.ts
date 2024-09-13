import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ReceiptUpdateDto } from '../../../../utils/types/dtos/receipts/update';
import { receiptGetController } from './get/receipt-get-controller';
import { receiptUpdateController } from './update/receipt-update-controller';

async function receiptHandler(
	req: ExtendedNextApiRequest<ReceiptUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Receipt Handler', req.method);

	switch (req.method) {
		case 'GET':
			await receiptGetController(req, res);
			break;

		case 'POST':
			await receiptUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default receiptHandler;
