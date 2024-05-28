import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { StudentFormsQueryDto } from '../../../../utils/types/dtos/student-forms/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { StudentFormsGetResponses } from '../../../../utils/types/responses/student-forms/get';
import { formsGetParseDto, formsGetServices } from './forms-get-services';

export async function formsGetController(
	req: ExtendedNextApiRequest<any, StudentFormsQueryDto>,
	res: NextApiResponse<StudentFormsGetResponses | ErrorResponse>,
) {
	devLog('Get Student Forms Handler', req.query);

	try {
		const getFormsDto = formsGetParseDto(req.query);
		const result = await formsGetServices(getFormsDto);

		devLog('Get Student Forms Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Student Forms Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
