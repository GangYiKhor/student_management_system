import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { getSingleTeachersServices } from './get-services';

export async function getSingleTeachersHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
	const id = parseInt(req.query.id[0]);

	try {
		const result = await getSingleTeachersServices(id);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Teachers Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Teachers Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Single Teachers',
			},
		});
	}
}
