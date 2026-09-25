import type { NextApiRequest, NextApiResponse } from 'next';
import { clearSession } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  clearSession(res);
  return res.status(204).end();
}
