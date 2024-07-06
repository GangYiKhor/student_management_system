import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../utils/constants/ErrorResponses';
import { devLog } from '../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { VoucherCreateDto } from '../../../utils/types/dtos/vouchers/create';
import { VouchersGetQueryDto } from '../../../utils/types/dtos/vouchers/get';
import { vouchersCreateController } from './create/vouchers-create-controller';
import { vouchersGetController } from './get/vouchers-get-controller';

async function vouchersHandler(
	req: ExtendedNextApiRequest<VoucherCreateDto, VouchersGetQueryDto>,
	res: NextApiResponse,
) {
	devLog('Vouchers Handler', req.method);

	switch (req.method) {
		case 'GET':
			await vouchersGetController(req, res);
			break;

		case 'POST':
			await vouchersCreateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default vouchersHandler;
