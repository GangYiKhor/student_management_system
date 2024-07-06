import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../../utils/devLog';
import { ExistedError } from '../../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { VoucherUpdateDto } from '../../../../../utils/types/dtos/vouchers/update';
import { voucherUpdateServices } from './voucher-update-services';

export async function voucherUpdateController(
	req: ExtendedNextApiRequest<VoucherUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Update Voucher Handler', req.query, req.body);

	try {
		await voucherUpdateServices(req.query.id, req.body);
		devLog('Update Voucher Handler: UPDATED');
		res.status(200).end();
	} catch (err) {
		devLog('Update Voucher Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
