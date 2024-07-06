import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExistedError } from '../../../../utils/errors/ExistedError';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { VoucherCreateDto } from '../../../../utils/types/dtos/vouchers/create';
import { vouchersCreateServices } from './vouchers-create-services';

export async function vouchersCreateController(
	req: ExtendedNextApiRequest<VoucherCreateDto>,
	res: NextApiResponse,
) {
	devLog('Create Voucher Handler', req.body);

	try {
		const result = await vouchersCreateServices(req.body);

		devLog('Create Voucher Handler: Responding', result);
		res.status(201).json(result);
	} catch (err: any) {
		devLog('Create Voucher Handler: ERROR', err);

		if (err instanceof ExistedError) {
			res.status(err.code).json(err.errorResponse);
		} else {
			res.status(503).json(DATABASE_ERROR);
		}
	}
}
