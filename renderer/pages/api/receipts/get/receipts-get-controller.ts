import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ReceiptsGetQueryDto } from '../../../../utils/types/dtos/receipts/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { ReceiptsGetResponses } from '../../../../utils/types/responses/receipts/get';
import { classGetParseDto, receiptsGetServices } from './receipts-get-services';

export async function receiptsGetController(
	req: ExtendedNextApiRequest<any, ReceiptsGetQueryDto>,
	res: NextApiResponse<ReceiptsGetResponses | ErrorResponse>,
) {
	devLog('Get Receipts Handler', req.query);

	try {
		const getClassDto = classGetParseDto(req.query);
		const result = await receiptsGetServices(getClassDto);

		devLog('Get Receipts Handler: Responding', result);
		res.status(200).json(result);
	} catch (error) {
		devLog('Get Receipts Handler: ERROR', error);
		res.status(503).json(DATABASE_ERROR);
	}
}
