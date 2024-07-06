import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { VoucherUpdateDto } from '../../../../utils/types/dtos/vouchers/update';
import { voucherGetController } from './get/voucher-get-controller';
import { voucherUpdateController } from './update/voucher-update-controller';

async function voucherHandler(
	req: ExtendedNextApiRequest<VoucherUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Voucher Handler', req.method);

	switch (req.method) {
		case 'GET':
			await voucherGetController(req, res);
			break;

		case 'POST':
			await voucherUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default voucherHandler;
