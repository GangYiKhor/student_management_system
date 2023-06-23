import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log(req.method);
	res.status(200).send("Hello World!");
}
