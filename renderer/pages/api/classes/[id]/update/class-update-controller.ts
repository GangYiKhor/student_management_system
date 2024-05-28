import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ClassUpdateDto } from '../../../../../utils/types/dtos/classes/update';
import { classUpdateServices } from './class-update-services';

export async function classUpdateController(
	req: ExtendedNextApiRequest<ClassUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Class Handler', req.query);

	try {
		await classUpdateServices(parseInt(req.query.id), req.body);
		devLog('Update Class Handler: UPDATED');
		res.status(200).end();
	} catch (err) {
		devLog('Update Class Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
