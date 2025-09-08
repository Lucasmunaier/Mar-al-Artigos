import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { id } = req.query;

  // PUT: Atualizar um produto
  if (req.method === 'PUT') {
    try {
      // A MUDANÇA ESTÁ AQUI: Recebemos os novos campos
      const { nome, descricao, preco, tamanhos, imagem_url, categoria_id } = req.body;
      const { data, error } = await supabase
        .from('produtos')
        .update({ nome, descricao, preco, tamanhos, imagem_url, categoria_id }) // Atualiza com os novos campos
        .eq('id', id)
        .select();

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE: Excluir um produto
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('produtos').delete().eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end(); // No Content
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default withIronSessionApiRoute(handler, sessionOptions);