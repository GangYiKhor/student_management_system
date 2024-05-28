import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TeacherCreateDto } from '../../../../utils/types/dtos/teachers/create';
import { createTeachersServices } from './teachers-create-services';

export async function createTeachersController(
	req: ExtendedNextApiRequest<TeacherCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Teachers Handler', req.body);

	try {
		await createTeachersServices(req.body);
		res.status(201).end();
	} catch (err) {
		devLog('Create Teachers Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
