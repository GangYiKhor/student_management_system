import { NextApiResponse } from 'next';
import { ClassCreateDto } from '../../../../dtos/class/create';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { classCreateServices } from './class-create-services';
import { ExistedError } from '../../../../utils/ExistedError';

export async function classCreateController(
	req: ExtendedNextApiRequest<ClassCreateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Class Handler', req.body);
	}

	try {
		const result = await classCreateServices(req.body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Create Class Handler: Responding', result);
		}

		res.status(201).json(result);
	} catch (err: any) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Create Class Handler: ERROR', err);
		}

		if (err instanceof ExistedError) {
			res.status(err.code).json({
				error: {
					title: 'Duplicate Package!',
					message: err.message,
					source: 'Create Class',
				},
			});
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Create Class',
			},
		});
	}
}
