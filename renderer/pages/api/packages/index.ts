import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { PackageCreateDto } from '../../../utils/types/dtos/packages/create';
import { PackagesGetQueryDto } from '../../../utils/types/dtos/packages/get';
import { packagesCreateController } from './create/packages-create-controller';
import { packagesGetController } from './get/packages-get-controller';

async function packagesHandler(
	req: ExtendedNextApiRequest<PackageCreateDto, PackagesGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Packages Handler', req.method);

	switch (req.method) {
		case 'GET':
			await packagesGetController(req, res);
			break;

		case 'POST':
			await packagesCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default packagesHandler;
