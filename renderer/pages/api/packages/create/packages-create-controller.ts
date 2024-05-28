import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { PackageCreateDto } from '../../../../utils/types/dtos/packages/create';
import { packagesCreateServices } from './packages-create-services';

export async function packagesCreateController(
	req: ExtendedNextApiRequest<PackageCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Packages Handler', req.body);

	try {
		const result = await packagesCreateServices(req.body);

		devLog('Create Packages Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Packages Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
