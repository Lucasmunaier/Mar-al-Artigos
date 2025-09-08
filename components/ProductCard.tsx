import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const whatsappNumber = '55SEUNUMERO'; // Substitua pelo seu número

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.preco);

  const message = `Olá! Tenho interesse no produto: ${product.nome} - ${formattedPrice}. Podemos conversar?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform transform hover:-translate-y-2">
      <img src={product.imagem_url} alt={`Imagem de ${product.nome}`} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{product.nome}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.descricao}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500">Tamanho: {product.tamanho}</p>
          <p className="text-lg font-bold text-green-700">{formattedPrice}</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto bg-green-500 text-white text-center font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors w-full"
        >
          Comprar via WhatsApp
        </a>
      </div>
    </div>
  );
};