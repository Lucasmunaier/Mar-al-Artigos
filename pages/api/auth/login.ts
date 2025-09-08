import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../utils/session';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // 1. Aceitar apenas o método POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, password } = req.body;

    // 2. Verificar as credenciais
    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // 3. Criar a sessão se as credenciais estiverem corretas
      req.session.user = { isLoggedIn: true };
      await req.session.save();
      return res.status(200).json({ ok: true });
    }

    // 4. Retornar erro se as credenciais forem inválidas
    return res.status(401).json({ message: 'Credenciais inválidas' });

  } catch (error) {
    return res.status(500).json({ message: 'Ocorreu um erro interno.' });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);