import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ClassUpdateDto } from '../../../../dtos/class/update';
import { classGetSingleController } from './get/class-get-single-controller';
import { classUpdateController } from './update/class-update-controller';

async function classSingleHandler(
	req: ExtendedNextApiRequest<ClassUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Single Class Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await classGetSingleController(req, res);
	} else if (req.method === 'POST') {
		await classUpdateController(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Single Class Handler',
			},
		});
	}
}

export default classSingleHandler;
