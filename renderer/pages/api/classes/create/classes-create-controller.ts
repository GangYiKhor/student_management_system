import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ClassCreateDto } from '../../../../utils/types/dtos/classes/create';
import { classesCreateServices } from './classes-create-services';

export async function classesCreateController(
	req: ExtendedNextApiRequest<ClassCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Class Handler', req.body);

	try {
		const result = await classesCreateServices(req.body);

		devLog('Create Class Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Class Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
