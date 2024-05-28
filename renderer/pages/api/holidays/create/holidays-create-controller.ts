import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { HolidayCreateDto } from '../../../../utils/types/dtos/holidays/create';
import { holidaysCreateServices } from './holidays-create-services';

export async function holidaysCreateController(
	req: ExtendedNextApiRequest<HolidayCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Holiday Handler', req.body);

	try {
		const result = await holidaysCreateServices(req.body);
		devLog('Create Holiday Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Holiday Handler: ERROR', err);
		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
