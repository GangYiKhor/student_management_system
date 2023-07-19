import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { PackagesGetResponse } from '../../../../responses/packages/get';
import { ErrorResponse } from '../../../../responses/error';
import { packagesGetSingleServices } from './packages-get-single-services';

export async function packagesGetSingleController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<PackagesGetResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Single Package Handler', req.query);
	}

	const id = parseInt(req.query.id);

	try {
		const result = await packagesGetSingleServices(id);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Package Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Package Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Single Package',
			},
		});
	}
}
