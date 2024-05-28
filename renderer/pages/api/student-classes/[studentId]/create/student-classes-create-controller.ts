import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { StudentClassCreateDto } from '../../../../../utils/types/dtos/student-classes/create';
import { studentClassesCreateServices } from './student-classes-create-services';

export async function studentClassesCreateController(
	req: ExtendedNextApiRequest<StudentClassCreateDto, { studentId: string }>,
	res: NextApiResponse,
) {
	devLog('Create/Update Student Class Handler', req.query, req.body);

	try {
		await studentClassesCreateServices(parseInt(req.query.studentId), req.body);
		devLog('Create/Update Student Class Handler: CREATED');
		res.status(200).end();
	} catch (err) {
		devLog('Create/Update Student Class Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
