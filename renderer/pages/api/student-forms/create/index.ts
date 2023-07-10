import { NextApiRequest, NextApiResponse } from 'next';
import { createForms } from './services';
import { StudentFormsCreateDto } from '../../../../dtos/student-forms/create';
import { StudentFormsCreateResponse } from '../../../../responses/student-forms/create';
import { ErrorResponse } from '../../../../responses/error';

async function createFormsHandler(
	req: NextApiRequest,
	res: NextApiResponse<StudentFormsCreateResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Form Handler', req.body);
	}
	const body: StudentFormsCreateDto = req.body;
	if (req.method === 'POST') {
		try {
			const result = await createForms(body.formName);

			if (process.env.NODE_ENV === 'development') {
				console.log('Create Form Handler: Responding', result);
			}

			res.status(201).json(result);
		} catch (err) {
			if (err.message === 'Duplicates Found!') {
				res.status(406).json({
					error: {
						title: 'Duplicate Form Name Found!',
						message: 'Please use a unique form name!',
						source: 'Create Student Forms',
					},
				});
			}

			res.status(503).json({
				error: {
					title: 'Server Internal Connection Error!',
					message: 'Unable to connect to database!',
					source: 'Create Student Forms',
				},
			});
		}
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Post Request Expected! Received: ${req.method}`,
				source: 'Create Student Forms',
			},
		});
	}
}

export default createFormsHandler;
