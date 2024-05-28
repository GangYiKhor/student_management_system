import { NextApiResponse } from 'next';
import { INVALID_REQUEST } from '../../../../utils/constants/ErrorResponses';
import { devLog } from '../../../../utils/devLog';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ClassUpdateDto } from '../../../../utils/types/dtos/classes/update';
import { classGetController } from './get/class-get-controller';
import { classUpdateController } from './update/class-update-controller';

async function classHandler(
	req: ExtendedNextApiRequest<ClassUpdateDto, { id: string }>,
	res: NextApiResponse,
) {
	devLog('Single Class Handler', req.method);

	switch (req.method) {
		case 'GET':
			await classGetController(req, res);
			break;

		case 'POST':
			await classUpdateController(req, res);
			break;

		default:
			res.status(400).json(INVALID_REQUEST);
	}
}

export default classHandler;
