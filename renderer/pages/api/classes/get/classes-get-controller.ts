import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ClassesGetQueryDto } from '../../../../utils/types/dtos/classes/get';
import { ClassesGetResponses } from '../../../../utils/types/responses/classes/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { classGetParseDto, classesGetServices } from './classes-get-services';

export async function classesGetController(
	req: ExtendedNextApiRequest<any, ClassesGetQueryDto>,
	res: NextApiResponse<ClassesGetResponses | ErrorResponse>,
) {
	devLog('Get Classes Handler', req.query);

	try {
		const getClassDto = classGetParseDto(req.query);
		const result = await classesGetServices(getClassDto);

		devLog('Get Classes Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Classes Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
