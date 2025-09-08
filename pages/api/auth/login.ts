import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '../../../utils/session';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  // A correção essencial para o erro 405 está aqui
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { username, password } = req.body;

    if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
      console.error('As variáveis de ambiente do admin não foram configuradas no servidor.');
      return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    }

    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASSWORD
    ) {
      req.session.user = { isLoggedIn: true };
      await req.session.save();
      return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ message: 'Credenciais inválidas' });

  } catch (error) {
    console.error('Erro na API de login:', error);
    return res.status(500).json({ message: 'Ocorreu um erro interno.' });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);