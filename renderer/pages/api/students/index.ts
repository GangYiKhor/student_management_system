import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { StudentCreateDto } from '../../../utils/types/dtos/students/create';
import { StudentsGetQueryDto } from '../../../utils/types/dtos/students/get';
import { studentsCreateController } from './create/students-create-controller';
import { studentsGetController } from './get/students-get-controller';

async function studentsHandler(
	req: ExtendedNextApiRequest<StudentCreateDto, StudentsGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Students Handler', req.method);

	switch (req.method) {
		case 'GET':
			await studentsGetController(req, res);
			break;

		case 'POST':
			await studentsCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default studentsHandler;
