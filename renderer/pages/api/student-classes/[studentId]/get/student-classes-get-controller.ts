import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { StudentClassesGetResponses } from '../../../../../utils/types/responses/student-classes/get';
import { studentClassesGetServices } from './student-classes-get-services';

export async function studentClassesGetController(
	req: ExtendedNextApiRequest<any, { studentId: string }>,
	res: NextApiResponse<StudentClassesGetResponses | ErrorResponse>,
) {
	devLog('Get Student Classes Handler', req.query);

	try {
		const result = await studentClassesGetServices(parseInt(req.query.studentId));
		devLog('Get Student Classes Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Student Classes Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
