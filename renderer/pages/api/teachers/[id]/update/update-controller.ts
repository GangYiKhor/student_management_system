import { NextApiResponse } from 'next';
import { TeachersUpdateDto } from '../../../../../dtos/teachers/update';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { updateTeachersServices } from './update-services';

export async function updateTeachersHandler(
	req: ExtendedNextApiRequest<TeachersUpdateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Teachers Handler', req.body);
	}

	const id = parseInt(req.query.id[0]);
	const body = req.body;
	try {
		const result = await updateTeachersServices(id, body);

		if (process.env.NODE_ENV === 'development') {
			console.log('Update Teachers Handler: Responding', result);
		}

		res.status(201).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Update Teachers Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Update Teachers',
			},
		});
	}
}
