import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { PackageUpdateDto } from '../../../../utils/types/dtos/packages/update';
import { packageGetController } from './get/package-get-controller';
import { packagesUpdateController } from './update/packages-update-controller';

async function packagesSingleHandler(
	req: ExtendedNextApiRequest<PackageUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Package Handler', req.method);

	switch (req.method) {
		case 'GET':
			await packageGetController(req, res);
			break;

		case 'POST':
			await packagesUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default packagesSingleHandler;
