import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentsGetQueryDto } from '../../../../utils/types/dtos/students/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { StudentsGetResponses } from '../../../../utils/types/responses/students/get';
import { studentsGetParseDto, studentsGetServices } from './students-get-services';

export async function studentsGetController(
	req: ExtendedNextApiRequest<any, StudentsGetQueryDto>,
	res: NextApiResponse<StudentsGetResponses | ErrorResponse>,
) {
	devLog('Get Students Handler', req.query);

	try {
		const getStudentsDto = studentsGetParseDto(req.query);
		const result = await studentsGetServices(getStudentsDto);

		devLog('Get Students Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Students Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
