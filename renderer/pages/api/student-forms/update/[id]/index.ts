import { NextApiRequest, NextApiResponse } from 'next';
import { updateForms } from './services';
import { StudentFormsUpdateDto } from '../../../../../dtos/student-forms/update';

async function updateFormsHandler(req: NextApiRequest, res: NextApiResponse) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Update Form Handler', req.body);
	}
	const body: StudentFormsUpdateDto = req.body;
	if (req.method === 'PUT') {
		try {
			res.status(200).json(await updateForms(req.query.id[0], body.status));
		} catch (err: any) {
			if (err?.message === 'Invalid ID') {
				res.status(400).send('Invalid Request!');
			} else {
				res.status(503).send('Unable to connect to database!');
			}
		}
	} else {
		res.status(400).send('Put Request Expected!');
	}
}

export default updateFormsHandler;
