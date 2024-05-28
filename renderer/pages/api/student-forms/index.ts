import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { StudentFormCreateDto } from '../../../utils/types/dtos/student-forms/create';
import { StudentFormsQueryDto } from '../../../utils/types/dtos/student-forms/get';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { StudentFormsGetResponses } from '../../../utils/types/responses/student-forms/get';
import { formsCreateController } from './create/forms-create-controller';
import { formsGetController } from './get/forms-get-controller';

async function formsHandler(
	req: ExtendedNextApiRequest<StudentFormCreateDto, StudentFormsQueryDto>,
	res: NextApiResponse<StudentFormsGetResponses | ErrorResponse>,
) {
	devLog('Student Forms Handler', req.method);

	switch (req.method) {
		case 'GET':
			await formsGetController(req, res);
			break;

		case 'POST':
			await formsCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default formsHandler;
