import { NextApiResponse } from 'next';
import { DATABASE_ERROR } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { PackagesGetQueryDto } from '../../../../utils/types/dtos/packages/get';
import { ErrorResponse } from '../../../../utils/types/responses/error';
import { PackagesGetResponses } from '../../../../utils/types/responses/packages/get';
import { packagesGetParseDto, packagesGetServices } from './packages-get-services';

export async function packagesGetController(
	req: ExtendedNextApiRequest<any, PackagesGetQueryDto>,
	res: NextApiResponse<PackagesGetResponses | ErrorResponse>,
) {
	devLog('Get Packages Handler', req.query);

	try {
		const getPackagesDto = packagesGetParseDto(req.query);
		const result = await packagesGetServices(getPackagesDto);

		devLog('Get Packages Handler: Responding', result);
		res.status(200).json(result);
	} catch (err) {
		devLog('Get Packages Handler: ERROR', err);
		res.status(503).json(DATABASE_ERROR);
	}
}
