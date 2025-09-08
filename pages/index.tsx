import Link from 'next/link';
import type { Product } from '../types';
import { supabase } from '../utils/supabaseClient';
import { ProductCard } from '../components/ProductCard';

// Busca os produtos no servidor antes de a página carregar
export async function getServerSideProps() {
  // Vamos buscar os 8 produtos mais recentes para usar como destaque
  const { data: products } = await supabase
    .from('produtos')
    .select('*, categorias(id, nome)')
    .order('created_at', { ascending: false }) // Ordena pelos mais recentes
    .limit(8); // Limita a 8 produtos

  return {
    props: {
      featuredProducts: products || [],
    },
  };
}

interface HomePageProps {
  featuredProducts: Product[];
}

export default function HomePage({ featuredProducts }: HomePageProps) {
  return (
    <>
      {/* 1. Banner Principal (Hero Section) */}
      <section className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('/banner-principal.jpg')" }}>
        {/* Overlay escuro para melhorar a legibilidade do texto */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">TÁTICO STORE</h1>
          <p className="text-lg md:text-xl mb-8">Equipamentos e artigos militares de alta performance.</p>
          <Link href="/products" legacyBehavior>
            <a className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
              Ver Todos os Produtos
            </a>
          </Link>
        </div>
      </section>

      {/* 2. Secção de Produtos em Destaque */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Produtos em Destaque</h2>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Nenhum produto em destaque no momento.</p>
        )}
      </section>
    </>
  );
}