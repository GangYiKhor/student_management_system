import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { TeacherCreateDto } from '../../../utils/types/dtos/teachers/create';
import { TeachersGetQueryDto } from '../../../utils/types/dtos/teachers/get';
import { createTeachersController } from './create/teachers-create-controller';
import { getTeachersController } from './get/teachers-get-controller';

async function teachersHandler(
	req: ExtendedNextApiRequest<TeacherCreateDto, TeachersGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Teachers Handler', req.method);

	switch (req.method) {
		case 'GET':
			await getTeachersController(req, res);
			break;

		case 'POST':
			await createTeachersController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default teachersHandler;
