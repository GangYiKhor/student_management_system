import { NextApiResponse } from 'next';
import { PackagesGetDto, PackagesGetQueryDto } from '../../../dtos/packages/get';
import { ExtendedNextApiRequest } from '../../../utils/extended-next-api-request';
import { PackagesGetResponse } from '../../../responses/packages/get';
import { ErrorResponse } from '../../../responses/error';
import { packagesGetServices } from './packages-get-services';

export async function packagesGetController(
	req: ExtendedNextApiRequest<any, PackagesGetQueryDto>,
	res: NextApiResponse<PackagesGetResponse[] | ErrorResponse>,
) {
	if (process.env.NODE_ENV === 'development') {
		console.log('Get Packages Handler', req.query);
	}

	const getPackagesDto: PackagesGetDto = {
		start_date: req.query.start_date ? new Date(req.query.start_date) : undefined,
		end_date: req.query.end_date ? new Date(req.query.end_date) : undefined,
		form_id: parseInt(req.query.form_id) || undefined,
		subject_count_from: parseInt(req.query.subject_count_from) || undefined,
		subject_count_to: parseInt(req.query.subject_count_to) || undefined,
		discount_per_subject: parseFloat(req.query.discount_per_subject) || undefined,
		orderBy: req.query.orderBy,
	};

	try {
		const result = await packagesGetServices(getPackagesDto);

		if (process.env.NODE_ENV === 'development') {
			console.log('Get Packages Handler: Responding', result);
		}

		res.status(200).json(result);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.log('Get Packages Handler: ERROR', err);
		}

		res.status(503).json({
			error: {
				title: 'Server Internal Connection Error!',
				message: 'Unable to connect to database!',
				source: 'Get Packages',
			},
		});
	}
}
