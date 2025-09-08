import Link from 'next/link';
import type { Product } from '../types';
import { supabase } from '../utils/supabaseClient';
import { ProductCard } from '../components/ProductCard';

export async function getServerSideProps() {
  const { data: products } = await supabase
    .from('produtos')
    .select('*, categorias(id, nome)')
    .order('created_at', { ascending: false })
    .limit(8);

  return {
    props: {
      featuredProducts: products || [],
    },
  };
}

interface HomePageProps {
  featuredProducts: Product[];
}

const HeroCarousel = ({ products }: { products: Product[] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      <div className="relative h-72 overflow-hidden rounded-lg md:h-[60vh]">
        {products.map((product, index) => (
          <div key={product.id} className="hidden duration-700 ease-in-out" data-carousel-item>
            <img 
              src={product.imagens_url[0]} 
              className="absolute block w-full h-full object-cover top-0 left-0" 
              alt={product.nome}
            />
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {products.map((_, index) => (
            <button key={index} type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label={`Slide ${index + 1}`} data-carousel-slide-to={index}></button>
        ))}
      </div>
      <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/></svg>
        </span>
      </button>
      <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
         <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
        </span>
      </button>
    </div>
  );
}


export default function HomePage({ featuredProducts }: HomePageProps) {
  return (
    <>
      <HeroCarousel products={featuredProducts} />

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