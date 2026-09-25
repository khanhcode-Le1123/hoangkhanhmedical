import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).setHeader('Allow', 'GET').end();
  const session = getSession(req);
  return session ? res.json({ user: { id: session.id, name: session.name, role: session.role } }) : res.status(401).json({ error: 'Chưa đăng nhập.' });
}
