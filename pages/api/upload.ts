// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false
  }
};


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      const file: File = Array.isArray(files.file) ? files.file[0] : files.file;
      const data = fs.readFileSync(file.filepath);

      fs.writeFileSync(`./public/uploads/${file.originalFilename}`, data);
    });

    res.status(200).json({ ok: 1 })
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
