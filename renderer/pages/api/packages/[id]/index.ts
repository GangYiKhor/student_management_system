import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { PackagesUpdateDto } from '../../../../dtos/packages/update';
import { packagesGetSingleController } from './get/packages-get-single-controller';
import { packagesUpdateController } from './update/packages-update-controller';

async function packagesHandler(
	req: ExtendedNextApiRequest<PackagesUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Single Packages Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await packagesGetSingleController(req, res);
	} else if (req.method === 'POST') {
		await packagesUpdateController(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Single Packages Handler',
			},
		});
	}
}

export default packagesHandler;
