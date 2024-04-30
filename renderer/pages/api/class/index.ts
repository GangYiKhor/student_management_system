import { NextApiResponse } from 'next';
import { ClassCreateDto } from '../../../dtos/class/create';
import { ClassGetQueryDto } from '../../../dtos/class/get';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { classGetController } from './get/class-get-controller';
import { classCreateController } from './create/class-create-controller';

async function classHandler(
	req: ExtendedNextApiRequest<ClassCreateDto, ClassGetQueryDto>,
	res: NextApiResponse,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Class Handler', req.query, req.body);
	}

	if (req.method === 'GET') {
		await classGetController(req, res);
	} else if (req.method === 'POST') {
		await classCreateController(req, res);
	} else {
		res.status(400).json({
			error: {
				title: 'Invalid Request!',
				message: `Get or Post Request Expected! Received: ${req.method}`,
				source: 'Class Handler',
			},
		});
	}
}

export default classHandler;
