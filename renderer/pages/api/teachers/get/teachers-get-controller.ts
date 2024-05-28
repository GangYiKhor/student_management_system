import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TeachersGetQueryDto } from '../../../../utils/types/dtos/teachers/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { TeachersGetResponses } from '../../../../utils/types/responses/teachers/get';
import { getTeachersParseDto, getTeachersServices } from './teachers-get-services';

export async function getTeachersController(
	req: ExtendedNextApiRequest<any, TeachersGetQueryDto>,
	res: NextApiResponse<TeachersGetResponses | ErrorResponse>,
) {
	devLog('Get Teachers Handler', req.query);

	try {
		const getTeachersDto = getTeachersParseDto(req.query);
		const result = await getTeachersServices(getTeachersDto);

		devLog('Get Teachers Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Teachers Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
