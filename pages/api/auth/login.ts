import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../utils/session';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.user = { isLoggedIn: true };
    await req.session.save();
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);