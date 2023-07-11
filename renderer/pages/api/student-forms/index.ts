import { NextApiResponse } from 'next';
import { getForms } from './services';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import { ErrorResponse } from '../../../responses/error';
import { StudentFormsGetDto } from '../../../dtos/student-forms/get';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';

async function getFormsHandler(
	req: ExtendedNextApiRequest,
	res: NextApiResponse<StudentFormsGetResponse | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Form Handler', req.query);
	}

	if (req.method !== 'GET') {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get Request Expected! Received: ${req.method}`,
				source: 'Get Student Forms',
			},
		});
		return;
	}

	const is_active = req.query.is_active ? req.query.is_active === 'true' : undefined;
	const orderBy = req.query.orderBy as string;

	try {
		const query: StudentFormsGetDto = {
			is_active,
			orderBy,
		};

		const result = await getForms(query);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Form Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Form Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Student Forms',
			},
		});
	}
}

export default getFormsHandler;
