import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../../utils/extended-next-api-request';
import { ClassGetResponse } from '../../../../../responses/class/get';
import { ErrorResponse } from '../../../../../responses/error';
import { classGetSingleServices } from './class-get-single-services';

export async function classGetSingleController(
	req: ExtendedNextApiRequest<any, { id: string }>,
	res: NextApiResponse<ClassGetResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Single Class Handler', req.query);
	}

	const id = parseInt(req.query.id);

	try {
		const result = await classGetSingleServices(id);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Class Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Single Class Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Single Class',
			},
		});
	}
}
