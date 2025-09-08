import { useState } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  // Futuramente, receberá a função para adicionar ao carrinho
  // onAddToCart: (product: Product, size: string) => void; 
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.tamanhos?.[0] || '');

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);
  
  // A lógica do WhatsApp será movida para o carrinho de compras,
  // mas vamos manter o botão desativado por enquanto.
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    // Lógica para adicionar ao carrinho virá na Parte 3
    alert(`Produto ${product.nome} (Tamanho: ${selectedSize}) adicionado ao carrinho! (Funcionalidade a ser implementada)`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2">
      <img src={product.imagem_url} alt={`Imagem de ${product.nome}`} className="w-full h-56 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-indigo-600 uppercase mb-1">
          {product.categoria?.nome || 'Sem Categoria'}
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