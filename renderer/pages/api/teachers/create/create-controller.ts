import { NextApiResponse } from 'next';
import { TeachersCreateDto } from '../../../../dtos/teachers/create';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { createTeachersServices } from './create-services';

export async function createTeachersHandler(
	req: ExtendedNextApiRequest<TeachersCreateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Teachers Handler', req.body);
	}

	const body = req.body;
	try {
		const result = await createTeachersServices(body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Create Teachers Handler: Responding', result);
		}

		res.status(201).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Create Teachers Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Create Teachers',
			},
		});
	}
}
