import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { ClassCreateDto } from '../../../utils/types/dtos/classes/create';
import { ClassesGetQueryDto } from '../../../utils/types/dtos/classes/get';
import { classesCreateController } from './create/classes-create-controller';
import { classesGetController } from './get/classes-get-controller';

async function classesHandler(
	req: ExtendedNextApiRequest<ClassCreateDto, ClassesGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Classes Handler', req.method);

	switch (req.method) {
		case 'GET':
			await classesGetController(req, res);
			break;

		case 'POST':
			await classesCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default classesHandler;
