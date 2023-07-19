import { NextApiResponse } from 'next';
import { PackagesUpdateDto } from '../../../../dtos/packages/update';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { packagesUpdateServices } from './packages.update-services';

export async function packagesUpdateController(
	req: ExtendedNextApiRequest<PackagesUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Packages Handler', req.query);
	}

	const id = parseInt(req.query.id);

	try {
		const result = await packagesUpdateServices(id, req.body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Update Packages Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Update Packages Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Update Packages',
			},
		});
	}
}
