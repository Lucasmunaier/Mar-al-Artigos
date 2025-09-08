import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Listar todas as categorias
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('categorias').select('*').order('nome');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: Criar uma nova categoria (protegido)
  if (req.method === 'POST') {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }
    const { nome } = req.body;
    const { data, error } = await supabase.from('categorias').insert({ nome }).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withIronSessionApiRoute(handler, sessionOptions);