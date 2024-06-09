import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TaxCreateDto } from '../../../../utils/types/dtos/taxes/create';
import { taxesCreateServices } from './taxes-create-services';

export async function taxesCreateController(
	req: ExtendedNextApiRequest<TaxCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Tax Handler', req.body);

	try {
		const result = await taxesCreateServices(req.body);

		devLog('Create Tax Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Tax Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
