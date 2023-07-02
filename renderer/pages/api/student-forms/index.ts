import { NextApiRequest, NextApiResponse } from 'next';
import { getForms } from './services';

async function getFormsHandler(req: NextApiRequest, res: NextApiResponse) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Create Form Handler', req.query);
	}
	if (req.method === 'GET') {
		try {
			res.status(200).json(await getForms());
		} catch (err) {
			res.status(503).send('Unable to connect to database!');
		}
	} else {
		res.status(400).send('Get Request Expected!');
	}
}

export default getFormsHandler;
