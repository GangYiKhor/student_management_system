import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { HolidaysGetResponse } from '../../../../../utils/types/responses/holidays/get';
import { holidayGetServices } from './holiday-get-services';

export async function holidayGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<HolidaysGetResponse | ErrorResponse>,
) {
	devLog('Get Single Holiday Handler', req.query);

	try {
		const result = await holidayGetServices(parseInt(req.query.id));
		devLog('Get Single Holiday Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Holiday Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
