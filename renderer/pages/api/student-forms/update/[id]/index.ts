import { NextApiRequest, NextApiResponse } from 'next';
import { updateForms } from './services';
import { StudentFormsUpdateDto } from '../../../../../dtos/student-forms/update';
import { StudentFormsUpdateResponse } from '../../../../../responses/student-forms/update';
import { ErrorResponse } from '../../../../../responses/error';

async function updateFormsHandler(
	req: NextApiRequest,
	res: NextApiResponse<StudentFormsUpdateResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Form Handler', req.body);
	}
	const body: StudentFormsUpdateDto = req.body;
	if (req.method === 'PUT') {
		try {
			res.status(200).json(await updateForms(req.query.id[0], body.status));
		} catch (err: any) {
			if (err?.message === 'Invalid ID') {
				res.status(400).json({
					error: {
						title: 'Invalid Request!',
						message: 'Invalid ID Given! Please try again with the correct ID!',
						source: 'Update Student Forms',
					},
				});
			} else {
				res.status(503).json({
					error: {
						title: 'Server Internal Connection Error!',
						message: 'Unable to connect to database!',
						source: 'Update Student Forms',
					},
				});
			}
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Put Request Expected! Received: ${req.method}`,
				source: 'Update Student Forms',
			},
		});
	}
}

export default updateFormsHandler;
