import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { VouchersGetQueryDto } from '../../../../utils/types/dtos/vouchers/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { VouchersGetResponses } from '../../../../utils/types/responses/vouchers/get';
import { voucherGetParseDto, vouchersGetServices } from './vouchers-get-services';

export async function vouchersGetController(
	req: ExtendedNextApiRequest<any, VouchersGetQueryDto>,
	res: NextApiResponse<VouchersGetResponses | ErrorResponse>,
) {
	devLog('Get Vouchers Handler', req.query);

	try {
		const getVoucherDto = voucherGetParseDto(req.query);
		const result = await vouchersGetServices(getVoucherDto);

		devLog('Get Vouchers Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Vouchers Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
