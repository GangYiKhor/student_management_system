import { NextApiResponse } from 'next';
import { PackagesCreateDto } from '../../../dtos/packages/create';
import { PackagesGetQueryDto } from '../../../dtos/packages/get';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { packagesGetController } from './get/packages-get-controller';
import { packagesCreateController } from './create/packages-create-controller';

async function packagesHandler(
	req: ExtendedNextApiRequest<PackagesCreateDto, PackagesGetQueryDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Packages Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await packagesGetController(req, res);
	} else if (req.method === 'POST') {
		await packagesCreateController(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Packages Handler',
			},
		});
	}
}

export default packagesHandler;
