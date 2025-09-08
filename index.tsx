import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO ---
// 1. Substitua pela URL do seu projeto Supabase.
const supabaseUrl = 'https://SEU_PROJETO_URL.supabase.co';
// 2. Substitua pela sua chave anônima (anon key) do Supabase.
const supabaseKey = 'SUA_CHAVE_ANON';
// 3. Substitua pelo seu número de WhatsApp no formato 55DDDNUMERO (ex: 5511999998888).
const whatsappNumber = '55SEUNUMERO';
// --- FIM DA CONFIGURAÇÃO ---

const supabase = createClient(supabaseUrl, supabaseKey);

// --- TIPOS ---
interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tamanho: string;
  imagem_url: string;
}

// --- COMPONENTES ---

const Header = ({ setPage }: { setPage: (page: 'home' | 'products') => void }) => (
  <header className="bg-gray-800 text-white shadow-md fixed top-0 left-0 right-0 z-10">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <h1 
        className="text-xl font-bold cursor-pointer hover:text-green-400 transition-colors"
        onClick={() => setPage('home')}
        aria-label="Página Inicial"
      >
        TÁTICO STORE
      </h1>
      <div>
        <button 
          onClick={() => setPage('home')}
          className="px-4 py-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="Ir para a página inicial"
        >
          Home
        </button>
        <button 
          onClick={() => setPage('products')}
          className="px-4 py-2 hover:bg-gray-700 rounded transition-colors"
          aria-label="Ver produtos"
        >
          Produtos
        </button>
      </div>
    </nav>
  </header>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4">&copy; {new Date().getFullYear()} Tático Store. Todos os direitos reservados.</p>
        <div className="flex justify-center space-x-6">
          <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">
            WhatsApp
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            Instagram
          </a>
        </div>
      </div>
    </footer>
);

const HomePage = ({ setPage }: { setPage: (page: 'products') => void }) => (
  <main className="container mx-auto px-6 py-24 text-center flex flex-col items-center justify-center min-h-screen">
    <div className="bg-white p-10 rounded-lg shadow-xl">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Bem-vindo à Tático Store</h2>
      <p className="text-lg text-gray-600 mb-8">Equipamentos e artigos militares de alta performance.</p>
      <button
        onClick={() => setPage('products')}
        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
        aria-label="Ver todos os produtos"
      >
        Ver Produtos
      </button>
    </div>
  </main>
);

const ProductCard = ({ product }: { product: Product }) => {
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
          aria-label={`Comprar ${product.nome} via WhatsApp`}
        >
          Comprar via WhatsApp
        </a>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('nome', { ascending: true });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        setError('Não foi possível carregar os produtos. Verifique as configurações no topo de index.tsx e se a tabela "produtos" existe no Supabase.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="container mx-auto px-6 py-24">
      <h2 className="text-3xl font-bold text-center mb-8">Nossos Produtos</h2>
      
      {loading && <p className="text-center">Carregando produtos...</p>}
      
      {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full">Nenhum produto encontrado. Adicione produtos no seu painel Supabase.</p>
          )}
        </div>
      )}
    </main>
  );
};

const App = () => {
  const [page, setPage] = useState<'home' | 'products'>('home');

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header setPage={setPage} />
      <div className="flex-grow">
        {page === 'home' ? <HomePage setPage={setPage} /> : <ProductsPage />}
      </div>
      <Footer />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);