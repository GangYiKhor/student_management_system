import { NextApiRequest, NextApiResponse } from 'next';
import { SubjectsCreateResponse } from '../../../../responses/subjects/create';
import { ErrorResponse } from '../../../../responses/error';
import { createSubjects } from './services';
import { SubjectsCreateDto } from '../../../../dtos/subjects/create';

async function createSubjectsHandler(
	req: NextApiRequest,
	res: NextApiResponse<SubjectsCreateResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Subjects Handler', req.body);
	}

	const body: SubjectsCreateDto = req.body;
	if (req.method === 'POST') {
		try {
			const result = await createSubjects(body);

			if (process.env.NODE_ENV === 'development') {
				console.log('Create Subjects Handler: Responding', result);
			}

			res.status(201).json(result);
		} catch (err) {
			res.status(503).json({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Create Subjects',
				},
			});
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Post Request Expected! Received: ${req.method}`,
				source: 'Create Subjects',
			},
		});
	}
}

export default createSubjectsHandler;
