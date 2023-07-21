import { NextApiResponse } from 'next';
import { PackagesCreateDto } from '../../../../dtos/packages/create';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { packagesCreateServices } from './packages.create-services';
import { ExistedError } from '../../../../utils/ExistedError';

export async function packagesCreateController(
	req: ExtendedNextApiRequest<PackagesCreateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Packages Handler', req.body);
	}

	try {
		const result = await packagesCreateServices(req.body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Create Packages Handler: Responding', result);
		}

		res.status(201).json(result);
	} catch (err: any) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Create Packages Handler: ERROR', err);
		}

		if (err instanceof ExistedError) {
			res.status(err.code).json({
				error: {
					title: 'Duplicate Package!',
					message: err.message,
					source: 'Create Packages',
				},
			});
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Create Packages',
			},
		});
	}
}
