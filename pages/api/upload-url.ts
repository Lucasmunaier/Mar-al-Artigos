import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { sessionOptions } from '../../utils/session';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Função para limpar o nome do ficheiro, removendo caracteres especiais
const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize('NFD') // Separa acentos dos caracteres
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .replace(/[^a-zA-Z0-9.\-_]/g, '-') // Substitui caracteres não seguros por hífens
    .replace(/--+/g, '-'); // Remove hífens duplicados
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }
  
  if (!req.session.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const { fileName } = req.body;
    
    // A MUDANÇA ESTÁ AQUI: Limpamos o nome do ficheiro
    const cleanFileName = sanitizeFileName(fileName);
    const uniqueFileName = `${Date.now()}-${cleanFileName}`;

    const { data, error } = await supabaseAdmin.storage
      .from('imagens-produtos')
      .createSignedUploadUrl(uniqueFileName);

    if (error) throw error;

    res.status(200).json({ token: data.token, path: data.path });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);