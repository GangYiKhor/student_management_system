import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { HolidayCreateDto } from '../../../utils/types/dtos/holidays/create';
import { HolidaysGetQueryDto } from '../../../utils/types/dtos/holidays/get';
import { holidaysCreateController } from './create/holidays-create-controller';
import { holidaysGetController } from './get/holidays-get-controller';

async function holidaysHandler(
	req: ExtendedNextApiRequest<HolidayCreateDto, HolidaysGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Holidays Handler', req.method);

	switch (req.method) {
		case 'GET':
			await holidaysGetController(req, res);
			break;

		case 'POST':
			await holidaysCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default holidaysHandler;
