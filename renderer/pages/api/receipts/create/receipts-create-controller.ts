import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { NotFoundError } from '../../../../utils/errors/NotFoundError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ReceiptCreateDto } from '../../../../utils/types/dtos/receipts/create';
import { receiptsCreateServices } from './receipts-create-services';

export async function receiptsCreateController(
	req: ExtendedNextApiRequest<ReceiptCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Receipt Handler', req.body);

	try {
		const result = await receiptsCreateServices(req.body);

		devLog('Create Receipt Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Receipt Handler: ERROR', err);
		if (err instanceof NotFoundError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
