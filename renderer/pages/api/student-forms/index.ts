import { NextApiRequest, NextApiResponse } from 'next';
import { getForms } from './services';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { ErrorResponse } from '../../../responses/error';

async function getFormsHandler(
	req: NextApiRequest,
	res: NextApiResponse<StudentFormsGetResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Form Handler', req.query);
	}
	if (req.method === 'GET') {
		try {
			res.status(200).json(await getForms());
		} catch (err) {
			res.status(503).json({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Get Student Forms',
				},
			});
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get Request Expected! Received: ${req.method}`,
				source: 'Get Student Forms',
			},
		});
	}
}

export default getFormsHandler;
