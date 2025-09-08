import { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product, Category } from '../types';
import { supabase } from '../utils/supabaseClient';

export async function getServerSideProps() {
  const { data: products } = await supabase.from('produtos').select('*, categorias(id, nome)');
  const { data: categories } = await supabase.from('categorias').select('*').order('nome');
  return {
    props: {
      initialProducts: products || [],
      initialCategories: categories || [],
    },
  };
}

interface ProductsPageProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductsPage({ initialProducts, initialCategories }: ProductsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [sortOrder, setSortOrder] = useState('a-z');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...initialProducts];
    if (selectedCategory !== 'TODOS') {
      products = products.filter(p => p.categorias.some(c => c.id === selectedCategory));
    }
    if (searchTerm) {
      products = products.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    switch (sortOrder) {
      case 'price-asc': products.sort((a, b) => a.preco - b.preco); break;
      case 'price-desc': products.sort((a, b) => b.preco - a.preco); break;
      case 'z-a': products.sort((a, b) => b.nome.localeCompare(a.nome)); break;
      case 'a-z': default: products.sort((a, b) => a.nome.localeCompare(a.nome)); break;
    }
    return products;
  }, [initialProducts, selectedCategory, searchTerm, sortOrder]);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Categorias</h3>
          <ul className="space-y-1">
            <li 
              onClick={() => setSelectedCategory('TODOS')}
              className={`cursor-pointer p-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === 'TODOS' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
            >
              Todos
            </li>
            {initialCategories.map(cat => (
              <li 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`cursor-pointer p-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {cat.nome}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select 
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="a-z">Nome (A-Z)</option>
            <option value="z-a">Nome (Z-A)</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
        
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center col-span-full bg-white p-10 rounded-lg shadow-md">
            <p className="text-gray-600">Nenhum produto encontrado com estes filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}