import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Listar todos os produtos (público)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: Criar um novo produto (protegido)
  if (req.method === 'POST') {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    const { nome, descricao, preco, tamanho, imagem_url } = req.body;
    const { data, error } = await supabase
      .from('produtos')
      .insert([{ nome, descricao, preco, tamanho, imagem_url }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withIronSessionApiRoute(handler, sessionOptions);