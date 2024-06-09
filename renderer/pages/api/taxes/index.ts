import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { TaxCreateDto } from '../../../utils/types/dtos/taxes/create';
import { TaxesGetQueryDto } from '../../../utils/types/dtos/taxes/get';
import { taxesCreateController } from './create/taxes-create-controller';
import { taxesGetController } from './get/taxes-get-controller';

async function taxesHandler(
	req: ExtendedNextApiRequest<TaxCreateDto, TaxesGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Taxes Handler', req.method);

	switch (req.method) {
		case 'GET':
			await taxesGetController(req, res);
			break;

		case 'POST':
			await taxesCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default taxesHandler;
