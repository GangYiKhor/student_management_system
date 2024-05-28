import { NextApiRequest, NextApiResponse } from 'next';
import { devLog } from '../../utils/devLog';
import prisma from '../../utils/prisma-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	devLog('Hello World', req.method);
	const result = await prisma.student.findMany();
	devLog(result);
	res.status(200).send('Hello World!');
}
