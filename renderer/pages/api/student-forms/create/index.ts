import { NextApiRequest, NextApiResponse } from 'next';
import { createForms } from './services';
import { StudentFormsCreateDto } from '../../../../dtos/student-forms/create';

async function createFormsHandler(req: NextApiRequest, res: NextApiResponse) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Form Handler', req.body);
	}
	const body: StudentFormsCreateDto = req.body;
	if (req.method === 'POST') {
		try {
			res.status(200).json(await createForms(body.formName));
		} catch (err) {
			res.status(503).send('Unable to connect to database!');
		}
	} else {
		res.status(400).send('Post Request Expected!');
	}
}

export default createFormsHandler;
