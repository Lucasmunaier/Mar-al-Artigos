import Link from 'next/link';
import type { Product, Category } from '../types';
import { supabase } from '../utils/supabaseClient';
import { ProductCard } from '../components/ProductCard';

interface CategoryWithImage extends Category {
  imagem_url: string;
}

export async function getServerSideProps() {
  // ALTERAÇÃO AQUI: Busca apenas produtos marcados como em_destaque = true
  const { data: products } = await supabase
    .from('produtos')
    .select('*, categorias(id, nome)')
    .eq('em_destaque', true)
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase.from('categorias').select('*');

  return {
    props: {
      featuredProducts: products || [],
      categories: categories || [],
    },
  };
}

interface HomePageProps {
  featuredProducts: Product[];
  categories: CategoryWithImage[];
}

export default function HomePage({ featuredProducts, categories }: HomePageProps) {
  // O JSX desta página (banner, secção de categorias, etc.) continua exatamente igual.
  // Não é preciso colar o código aqui novamente.
}