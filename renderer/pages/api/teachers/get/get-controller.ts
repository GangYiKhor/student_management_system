import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { TeachersGetDto } from '../../../../dtos/teachers/get';
import { getTeachersServices } from './get-services';

export async function getTeachersHandler(req: ExtendedNextApiRequest, res: NextApiResponse) {
	const id = parseInt(req.query.id as string) || undefined;
	const teacher_name = (req.query.teacher_name as string) || undefined;
	const ic = (req.query.ic as string) || undefined;
	const phone_number = (req.query.phone_number as string) || undefined;
	const email = (req.query.email as string) || undefined;
	const address = (req.query.address as string) || undefined;
	const start_date = req.query.start_date ? new Date(req.query.start_date as string) : undefined;
	const end_date = req.query.end_date ? new Date(req.query.end_date as string) : undefined;
	const is_active = req.query.is_active ? req.query.is_active === 'true' : undefined;
	const orderBy = req.query.orderBy as string;

	const query: TeachersGetDto = {
		id,
		teacher_name,
		ic,
		phone_number,
		email,
		address,
		start_date,
		end_date,
		is_active,
		orderBy,
	};

	try {
		const result = await getTeachersServices(query);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Teachers Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Teachers Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Teachers',
			},
		});
	}
}
