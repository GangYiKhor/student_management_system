import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { HolidaysGetQueryDto } from '../../../../utils/types/dtos/holidays/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { HolidaysGetResponses } from '../../../../utils/types/responses/holidays/get';
import { holidaysGetParseDto, holidaysGetServices } from './holidays-get-services';

export async function holidaysGetController(
	req: ExtendedNextApiRequest<any, HolidaysGetQueryDto>,
	res: NextApiResponse<HolidaysGetResponses | ErrorResponse>,
) {
	devLog('Get Holidays Handler', req.query);

	try {
		const getHolidaysDto = holidaysGetParseDto(req.query);
		const result = await holidaysGetServices(getHolidaysDto);

		devLog('Get Holidays Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Holidays Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
