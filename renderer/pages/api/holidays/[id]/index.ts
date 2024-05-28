import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { HolidayUpdateDto } from '../../../../utils/types/dtos/holidays/update';
import { holidayGetController } from './get/holiday-get-controller';
import { holidayUpdateController } from './update/holiday-update-controller';

async function holidayHandler(
	req: ExtendedNextApiRequest<HolidayUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Holiday Handler', req.method);

	switch (req.method) {
		case 'GET':
			await holidayGetController(req, res);
			break;

		case 'POST':
			await holidayUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default holidayHandler;
