// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let files = fs.readdirSync('./public/uploads');

    res.status(200).json({ files })
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
