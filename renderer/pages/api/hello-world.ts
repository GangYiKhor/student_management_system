import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log(req.method);
	const result = await prisma.student.findMany();
	console.log(result);
	res.status(200).send("Hello World!");
}
