import Link from 'next/link';
import type { Product, Category } from '../types';
import { supabase } from '../utils/supabaseClient';
import { ProductCard } from '../components/ProductCard';

// Tipagem para incluir a nova imagem da categoria
interface CategoryWithImage extends Category {
  imagem_url: string;
}

export async function getServerSideProps() {
  // Busca os 8 produtos mais recentes para os destaques
  const { data: products } = await supabase
    .from('produtos')
    .select('*, categorias(id, nome)')
    .order('created_at', { ascending: false })
    .limit(8);

  // Busca as categorias para a nova secção
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
  return (
    <div className="bg-gray-50">
      {/* 1. Novo Banner Principal Fixo */}
      <section 
        className="relative h-[50vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center text-white" 
        style={{ backgroundImage: "url('/banner-principal.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Marçal Artigos Militares</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Equipamentos e artigos táticos de alta performance para a sua missão.</p>
          <Link href="/products" legacyBehavior>
            <a className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
              Explorar Produtos
            </a>
          </Link>
        </div>
      </section>

      {/* 2. Nova Secção de Categorias */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-2">Navegue por Categorias</h2>
        <p className="text-center text-gray-600 mb-8">Encontre exatamente o que você precisa.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`} legacyBehavior>
              <a className="relative rounded-lg overflow-hidden group h-48">
                <img 
                  src={category.imagem_url || '/placeholder.png'} 
                  alt={category.nome} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">{category.nome}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Secção de Produtos em Destaque Melhorada */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nossos Destaques</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Nenhum produto em destaque no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}