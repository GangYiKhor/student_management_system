import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { PackageUpdateDto } from '../../../../../utils/types/dtos/packages/update';
import { packagesUpdateServices } from './packages-update-services';

export async function packagesUpdateController(
	req: ExtendedNextApiRequest<PackageUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Packages Handler', req.query);

	try {
		const result = await packagesUpdateServices(parseInt(req.query.id), req.body);

		devLog('Update Packages Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Update Packages Handler: ERROR', err);
		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
