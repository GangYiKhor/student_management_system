import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { TaxUpdateDto } from '../../../../../utils/types/dtos/taxes/update';
import { taxUpdateServices } from './tax-update-services';

export async function taxUpdateController(
	req: ExtendedNextApiRequest<TaxUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Tax Handler', req.query, req.body);

	try {
		await taxUpdateServices(parseInt(req.query.id), req.body);
		devLog('Update Tax Handler: UPDATED');
		res.status(200).end();
	} catch (err) {
		devLog('Update Tax Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
