import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { NotFoundError } from '../../../../utils/errors/NotFoundError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ReceiptGenerateDto } from '../../../../utils/types/dtos/receipts/generate';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { ReceiptGenerateResponse } from '../../../../utils/types/responses/receipts/generate';
import { receiptGenerateServices } from './receipt-generate-create-services';

export async function receiptGenerateController(
	req: ExtendedNextApiRequest<ReceiptGenerateDto>,
	res: NextApiResponse<ReceiptGenerateResponse | ErrorResponse>,
) {
	devLog('Generate Receipt Handler', req.body);

	try {
		const result = await receiptGenerateServices(req.body);

		devLog('Generate Receipt Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Generate Receipt Handler: ERROR', err);

		if (err instanceof NotFoundError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
