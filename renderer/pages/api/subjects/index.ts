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

	const body: SubjectsGetDto = req.body;
	if (req.method === 'GET') {
		try {
			res.status(200).json(await getSubjects(body));
		} catch (err) {
			res.status(503).send({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Get Subjects',
				},
			});
		}
	} else {
		res.status(400).send({
			error: {
				title: 'Invalid Request!',
				message: `Get Request Expected! Received: ${req.method}`,
				source: 'Get Subjects',
			},
		});
	}
}
