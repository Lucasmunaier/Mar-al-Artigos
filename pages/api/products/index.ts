import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Garante que as chaves do Supabase estão disponíveis
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'As variáveis de ambiente do Supabase não estão configuradas.' });
  }

  // GET: Listar todos os produtos (público)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST: Criar um novo produto (protegido)
  if (req.method === 'POST') {
    // Verifica se o utilizador tem login
    if (!req.session.user) {
        return res.status(401).json({ message: 'Não autorizado' });
    }
    
    try {
      const { nome, descricao, preco, tamanho, imagem_url } = req.body;
      const { data, error } = await supabase
        .from('produtos')
        .insert([{ nome, descricao, preco, tamanho, imagem_url }])
        .select();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Se o método não for GET ou POST, rejeita
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withIronSessionApiRoute(handler, sessionOptions);