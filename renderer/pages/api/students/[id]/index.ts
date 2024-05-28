import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentsUpdateDto } from '../../../../utils/types/dtos/students/update';
import { studentGetController } from './get/student-get-controller';
import { studentUpdateController } from './update/student-update-controller';

async function studentHandler(
	req: ExtendedNextApiRequest<StudentsUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Student Handler', req.method);

	switch (req.method) {
		case 'GET':
			await studentGetController(req, res);
			break;

		case 'POST':
			await studentUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default studentHandler;
