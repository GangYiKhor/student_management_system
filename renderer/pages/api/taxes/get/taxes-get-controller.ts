import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TaxesGetQueryDto } from '../../../../utils/types/dtos/taxes/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { TaxesGetResponses } from '../../../../utils/types/responses/taxes/get';
import { taxesGetParseDto, taxesGetServices } from './taxes-get-services';

export async function taxesGetController(
	req: ExtendedNextApiRequest<any, TaxesGetQueryDto>,
	res: NextApiResponse<TaxesGetResponses | ErrorResponse>,
) {
	devLog('Get Taxes Handler', req.query);

	try {
		const getTaxesDto = taxesGetParseDto(req.query);
		const result = await taxesGetServices(getTaxesDto);

		devLog('Get Taxes Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Taxes Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
