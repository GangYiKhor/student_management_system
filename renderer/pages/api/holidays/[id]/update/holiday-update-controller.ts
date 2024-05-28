import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { HolidayUpdateDto } from '../../../../../utils/types/dtos/holidays/update';
import { holidayUpdateServices } from './holiday-update-services';

export async function holidayUpdateController(
	req: ExtendedNextApiRequest<HolidayUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Holiday Handler', req.query);

	try {
		await holidayUpdateServices(parseInt(req.query.id), req.body);
		devLog('Update Holiday Handler: UPDATED');
		res.status(200).end();
	} catch (err) {
		devLog('Update Holiday Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
