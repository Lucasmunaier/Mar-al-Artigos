import { useState } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.tamanhos?.[0] || '');
  // Novo estado para controlar qual imagem está a ser mostrada
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    alert(`Produto ${product.nome} (Tamanho: ${selectedSize}) adicionado ao carrinho! (Funcionalidade a ser implementada)`);
  };

  // Funções para navegar entre as imagens
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imagens_url.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imagens_url.length) % product.imagens_url.length);
  };
  
  const hasMultipleImages = product.imagens_url && product.imagens_url.length > 1;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2">
      {/* Secção da Imagem - agora é um mini carrossel */}
      <div className="relative w-full h-56 bg-gray-200">
        <img 
          // Mostra a imagem atual baseada no índice
          src={product.imagens_url?.[currentImageIndex] || '/placeholder.png'} 
          alt={`Imagem de ${product.nome}`} 
          className="w-full h-full object-cover" 
        />
        {/* Botões de navegação, só aparecem se houver mais de uma imagem */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={goToPrevImage}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-60 transition-opacity"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={goToNextImage}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-1 hover:bg-opacity-60 transition-opacity"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-indigo-600 uppercase mb-1">
          {product.categorias?.[0]?.nome || 'Sem Categoria'}
        </span>
        <h3 className="text-xl font-bold mb-2">{product.nome}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.descricao}</p>
        
        <div className="mb-4">
          <label htmlFor={`size-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Tamanho:
          </label>
          <select
            id={`size-${product.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"
          >
            {product.tamanhos?.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold text-green-700">{formattedPrice}</p>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="mt-auto bg-green-500 text-white text-center font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors w-full"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};