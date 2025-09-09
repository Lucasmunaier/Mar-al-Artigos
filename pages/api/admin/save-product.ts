import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { sessionOptions } from '../../../utils/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  if (!req.session.user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { productData, selectedCategories, isEditing } = req.body;
  const { id, ...dataToSave } = productData;

  try {
    let savedProduct;

    if (isEditing) {
      const { data, error } = await supabase.from('produtos').update(dataToSave).eq('id', id).select().single();
      if (error) throw error;
      savedProduct = data;
    } else {
      const { data, error } = await supabase.from('produtos').insert(dataToSave).select().single();
      if (error) throw error;
      savedProduct = data;
    }

    await supabase.from('produtos_categorias').delete().eq('produto_id', savedProduct.id);
    
    if (selectedCategories && selectedCategories.length > 0) {
      const categoryLinks = selectedCategories.map((catId: string) => ({
        produto_id: savedProduct.id,
        categoria_id: catId,
      }));
      const { error: insertError } = await supabase.from('produtos_categorias').insert(categoryLinks);
      if (insertError) throw insertError;
    }
    
    return res.status(200).json(savedProduct);

  } catch (error: any) {
    console.error('Erro ao salvar produto:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);