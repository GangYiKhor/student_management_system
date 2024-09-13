import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { ReceiptCreateDto } from '../../../utils/types/dtos/receipts/create';
import { ReceiptsGetQueryDto } from '../../../utils/types/dtos/receipts/get';
import { receiptsCreateController } from './create/receipts-create-controller';
import { receiptsGetController } from './get/receipts-get-controller';

async function receiptsHandler(
	req: ExtendedNextApiRequest<ReceiptCreateDto, ReceiptsGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Receipts Handler', req.method);

	switch (req.method) {
		case 'GET':
			await receiptsGetController(req, res);
			break;

		case 'POST':
			await receiptsCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default receiptsHandler;
