import { NextApiRequest } from 'next';

export interface ExtendedNextApiRequest<Body = any> extends NextApiRequest {
	body: Body;
}
