import { NextApiRequest } from 'next';

export interface ExtendedNextApiRequest<
	Body = any,
	Query extends Partial<{ [key: string]: string | string[] }> = {
		[key: string]: string | string[];
	},
> extends NextApiRequest {
	body: Body;
	query: Query;
}
