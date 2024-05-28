import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TeacherUpdateDto } from '../../../../utils/types/dtos/teachers/update';
import { getTeacherController } from './get/teacher-get-controller';
import { updateTeacherController } from './update/teacher-update-controller';

async function teacherHandler(
	req: ExtendedNextApiRequest<TeacherUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Teacher Single Handler', req.method);

	switch (req.method) {
		case 'GET':
			await getTeacherController(req, res);
			break;

		case 'POST':
			await updateTeacherController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default teacherHandler;
