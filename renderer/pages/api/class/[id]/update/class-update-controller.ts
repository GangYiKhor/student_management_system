import { NextApiResponse } from 'next';
import { PackagesUpdateDto } from '../../../../../dtos/packages/update';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { classUpdateServices } from './class-update-services';
import { ExistedError } from '../../../../../utils/ExistedError';

export async function classUpdateController(
	req: ExtendedNextApiRequest<PackagesUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Class Handler', req.query);
	}

	const id = parseInt(req.query.id);

	try {
		const result = await classUpdateServices(id, req.body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Update Class Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Update Class Handler: ERROR', err);
		}

		if (err instanceof ExistedError) {
			res.status(err.code).json({
				error: {
					title: 'Duplicate Package!',
					message: err.message,
					source: 'Update Class',
				},
			});
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Update Class',
			},
		});
	}
}
