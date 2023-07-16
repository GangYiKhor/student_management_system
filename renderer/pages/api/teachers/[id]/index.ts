import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TeachersUpdateDto } from '../../../../dtos/teachers/update';
import { updateTeachersHandler } from './update/update-controller';
import { getSingleTeachersHandler } from './get/get-controller';

async function teachersSingleHandler(
	req: ExtendedNextApiRequest<TeachersUpdateDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Teachers Single Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await getSingleTeachersHandler(req, res);
	} else if (req.method === 'POST') {
		await updateTeachersHandler(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Teachers Single Handler',
			},
		});
	}
}

export default teachersSingleHandler;
