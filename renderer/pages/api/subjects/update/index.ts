import { NextApiRequest, NextApiResponse } from 'next';
import { SubjectsUpdateResponse } from '../../../../responses/subjects/update';
import { ErrorResponse } from '../../../../responses/error';
import { SubjectsUpdateDto } from '../../../../dtos/subjects/update';
import { updateSubjects } from './services';

async function updateSubjectsHandler(
	req: NextApiRequest,
	res: NextApiResponse<SubjectsUpdateResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Subjects Handler', req.body);
	}
	const body: SubjectsUpdateDto = req.body;
	if (req.method === 'POST') {
		try {
			res.status(201).json(await updateSubjects(body));
		} catch (err) {
			res.status(503).json({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Update Subjects',
				},
			});
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Post Request Expected! Received: ${req.method}`,
				source: 'Update Subjects',
			},
		});
	}
}

export default updateSubjectsHandler;
