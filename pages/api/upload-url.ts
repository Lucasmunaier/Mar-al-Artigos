import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sessionOptions } from '../../utils/session';

// Cliente Admin que usa a chave secreta do servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }
  
  if (!req.session.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const { fileName } = req.body;
    const uniqueFileName = `${Date.now()}-${fileName}`;

    // Gera o URL assinado E o token de acesso
    const { data, error } = await supabaseAdmin.storage
      .from('imagens-produtos')
      .createSignedUploadUrl(uniqueFileName);

    if (error) throw error;

    // A MUDANÇA ESTÁ AQUI: Enviamos o token e o caminho separadamente
    res.status(200).json({ token: data.token, path: data.path });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);