import { NextApiResponse } from 'next';
import { ClassGetDto, ClassGetQueryDto } from '../../../../dtos/class/get';
import { ExtendedNextApiRequest } from '../../../../utils/extended-next-api-request';
import { ClassGetResponse } from '../../../../responses/class/get';
import { ErrorResponse } from '../../../../responses/error';
import { classGetServices } from './class-get-services';
import {
	parseDateOrUndefined,
	parseFloatOrUndefined,
	parseIntOrUndefined,
} from '../../../../utils/parser';

export async function classGetController(
	req: ExtendedNextApiRequest<any, ClassGetQueryDto>,
	res: NextApiResponse<ClassGetResponse[] | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Class Handler', req.query);
	}

	const getPackagesDto: ClassGetDto = {
		teacher_id: parseIntOrUndefined(req.query.teacher_id),
		start_date: parseDateOrUndefined(req.query.start_date),
		end_date: parseDateOrUndefined(req.query.end_date),
		class_year: parseIntOrUndefined(req.query.class_year),
		form_id: parseIntOrUndefined(req.query.form_id),
		day: parseIntOrUndefined(req.query.day),
		start_time: parseDateOrUndefined(req.query.start_time),
		end_time: parseDateOrUndefined(req.query.end_time),
		fees: parseFloatOrUndefined(req.query.fees),
		is_package: req.query.is_package === 'true',
		class_name: req.query.class_name,
		orderBy: req.query.orderBy,
	};

	try {
		const result = await classGetServices(getPackagesDto);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Class Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Class Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Class',
			},
		});
	}
}
