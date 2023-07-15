import { NextApiResponse } from 'next';
import { TeachersCreateDto } from '../../../dtos/teachers/create';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { getTeachersHandler } from './get/get-controller';
import { createTeachersHandler } from './create/create-controller';

async function teachersHandler(
	req: ExtendedNextApiRequest<TeachersCreateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Teachers Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await getTeachersHandler(req, res);
	} else if (req.method === 'POST') {
		await createTeachersHandler(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Teachers Handler',
			},
		});
	}
}

export default teachersHandler;
