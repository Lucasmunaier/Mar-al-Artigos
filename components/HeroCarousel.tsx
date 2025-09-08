import type { Product } from '../types';

interface HeroCarouselProps {
  products: Product[];
}

export const HeroCarousel = ({ products }: HeroCarouselProps) => {
  if (!products || products.length === 0) {
    return null; // Não mostra nada se não houver produtos
  }

  return (
    <div id="default-carousel" className="relative w-full" data-carousel="slide">
      {/* Itens do Carrossel */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {products.map((product, index) => (
          <div key={index} className="hidden duration-700 ease-in-out" data-carousel-item>
            <img 
              src={product.imagens_url[0]} // Mostra a primeira imagem do produto
              className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" 
              alt={product.nome}
            />
          </div>
        ))}
      </div>
      {/* Controlos Laterais */}
      <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        {/* ... SVG do ícone "anterior" ... */}
      </button>
      <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        {/* ... SVG do ícone "próximo" ... */}
      </button>
    </div>
  );
};