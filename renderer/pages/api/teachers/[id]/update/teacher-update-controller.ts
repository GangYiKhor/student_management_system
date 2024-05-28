import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { TeacherUpdateDto } from '../../../../../utils/types/dtos/teachers/update';
import { updateTeachersServices } from './teacher-update-services';

export async function updateTeacherController(
	req: ExtendedNextApiRequest<TeacherUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Teacher Handler', req.body);

	try {
		await updateTeachersServices(parseInt(req.query.id), req.body);
		res.status(201).end();
	} catch (err) {
		devLog('Update Teacher Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
