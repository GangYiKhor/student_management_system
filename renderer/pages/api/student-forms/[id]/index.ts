import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentFormUpdateDto } from '../../../../utils/types/dtos/student-forms/update';
import { studentFormGetController } from './get/form-get-controller';
import { studentFormUpdateController } from './update/form-update-controller';

async function studentFormSingleHandler(
	req: ExtendedNextApiRequest<StudentFormUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Student Form Handler', req.method);

	switch (req.method) {
		case 'GET':
			await studentFormGetController(req, res);
			break;

		case 'POST':
			await studentFormUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default studentFormSingleHandler;
