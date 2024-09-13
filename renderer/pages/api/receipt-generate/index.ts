import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { ReceiptGenerateDto } from '../../../utils/types/dtos/receipts/generate';
import { receiptGenerateController } from './create/receipt-generate-create-controller';

async function receiptGenerateHandler(
	req: ExtendedNextApiRequest<ReceiptGenerateDto>,
	res: NextApiResponse,
) {
	devLog('Receipt Generate Handler', req.method);

	if (req.method == 'POST') {
		await receiptGenerateController(req, res);
	} else {
		res.status(400).json(INVALID_REQUEST);
	}
}

export default receiptGenerateHandler;
