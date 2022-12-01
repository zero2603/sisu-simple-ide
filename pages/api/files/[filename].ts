// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { filename } = req.query
    const path = `./public/uploads/${filename}`;

    if (req.method === 'GET') {
        const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });

        res.status(200).json({ content: data })
    } else if (req.method === 'POST') {
        const { content } = req.body;

        fs.writeFileSync(path, content, { encoding: 'utf8', flag: 'w' });

        res.status(200).json({ ok: 1 })
    } else if (req.method === 'DELETE') {
        fs.unlink(path, (err) => {
            if (err) throw err;
        });

        res.send({ ok: 1 });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
