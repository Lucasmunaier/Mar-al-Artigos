import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../utils/supabaseClient'; // Usaremos o cliente admin aqui
import { sessionOptions } from '../../utils/session';
import { createClient } from '@supabase/supabase-js';

// Precisamos de um cliente Supabase com a Service Key para criar URLs assinados
// ATENÇÃO: Adicione a SUPABASE_SERVICE_KEY às suas variáveis de ambiente na Vercel
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  
  // Protege a rota, apenas o admin pode gerar URLs
  if (!req.session.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'Nome e tipo do ficheiro são obrigatórios.' });
    }

    // Cria um nome de ficheiro único para evitar conflitos
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('imagens-produtos')
      .createSignedUploadUrl(uniqueFileName);

    if (error) {
      throw error;
    }

    res.status(200).json({ uploadUrl: data.signedUrl, publicUrl: uniqueFileName });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);