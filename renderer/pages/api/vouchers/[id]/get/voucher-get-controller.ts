import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ErrorResponse } from '../../../../../utils/types/responses/error';
import { VouchersGetResponse } from '../../../../../utils/types/responses/vouchers/get';
import { voucherGetServices } from './voucher-get-services';

export async function voucherGetController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<VouchersGetResponse | ErrorResponse>,
) {
	devLog('Get Single Voucher Handler', req.query);

	try {
		const result = await voucherGetServices(req.query.id);
		devLog('Get Single Voucher Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Single Voucher Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
