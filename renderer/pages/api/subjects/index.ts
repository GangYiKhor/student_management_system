import { NextApiRequest, NextApiResponse } from 'next';
import { SubjectsGetResponse } from '../../../responses/subjects/get';
import { ErrorResponse } from '../../../responses/error';
import { getSubjects } from './services';
import { SubjectsGetDto } from '../../../dtos/subjects/get';

async function getSubjectsHandler(
	req: NextApiRequest,
	res: NextApiResponse<SubjectsGetResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Subjects Handler', req.query);
	}

	const body: SubjectsGetDto = req.query;
	if (req.method === 'GET') {
		try {
			body.id = req.query.id ? parseInt(req.query.id as string) : undefined;
			body.form_id = req.query.form_id ? parseInt(req.query.form_id as string) : undefined;
			body.is_active = req.query.is_active ? req.query.is_active === 'true' : undefined;

			const result = await getSubjects(body);

			if (process.env.NODE_ENV === 'development') {
				console.log('Get Subjects Handler: Responding', result);
			}

			res.status(200).json(result);
		} catch (err) {
			console.log(err);
			res.status(503).json({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Get Subjects',
				},
			});
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get Request Expected! Received: ${req.method}`,
				source: 'Get Subjects',
			},
		});
	}
}

export default getSubjectsHandler;
