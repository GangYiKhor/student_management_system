import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TaxUpdateDto } from '../../../../utils/types/dtos/taxes/update';
import { taxGetController } from './get/tax-get-controller';
import { taxUpdateController } from './update/tax-update-controller';

async function taxHandler(
	req: ExtendedNextApiRequest<TaxUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Tax Handler', req.method);

	switch (req.method) {
		case 'GET':
			await taxGetController(req, res);
			break;

		case 'POST':
			await taxUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default taxHandler;
