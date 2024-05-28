import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentClassCreateDto } from '../../../../utils/types/dtos/student-classes/create';
import { studentClassesCreateController } from './create/student-classes-create-controller';
import { studentClassesGetController } from './get/student-classes-get-controller';

async function studentClassesHandler(
	req: ExtendedNextApiRequest<StudentClassCreateDto, { studentId: string }>,
	res: NextApiResponse,
) {
	devLog('Student Classes Handler', req.method);

	switch (req.method) {
		case 'GET':
			studentClassesGetController(req, res);
			break;

		case 'POST':
			await studentClassesCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default studentClassesHandler;
