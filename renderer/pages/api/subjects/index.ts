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

	if (req.method !== 'GET') {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get Request Expected! Received: ${req.method}`,
				source: 'Get Subjects',
			},
		});
		return;
	}

	const id = parseInt(req.query.id as string) || undefined;
	const form_id = parseInt(req.query.form_id as string) || undefined;
	const subject_name = req.query.subject_name as string | undefined;
	const is_active = req.query.is_active ? req.query.is_active === 'true' : undefined;
	const orderBy = req.query.orderBy as string;

	const query: SubjectsGetDto = {
		id,
		form_id,
		subject_name,
		is_active,
		orderBy,
	};

	try {
		const result = await getSubjects(query);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Subjects Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Subjects Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Subjects',
			},
		});
	}
}

export default getSubjectsHandler;
