import Link from 'next/link';
import type { Category } from '../types';

interface HeaderProps {
  categories: Category[];
}

export const Header = ({ categories }: HeaderProps) => {
  return (
    <header className="shadow-lg bg-white sticky top-0 z-50">
      <div className="bg-gray-800 text-white text-center p-2 text-sm font-semibold">
        <span>FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 200</span>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold text-gray-900">
            Marçal Artigos Militares
          </a>
        </Link>
        <div className="flex-grow max-w-xl mx-8 hidden lg:flex">
          <input
            type="text"
            placeholder="O que você procura?"
            className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white p-3 rounded-r-md hover:bg-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative">
            <svg className="w-7 h-7 text-gray-700 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
          </button>
        </div>
      </div>

      <nav className="bg-gray-50 border-t border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-center flex-wrap gap-x-8 text-sm font-bold">
            {categories.map(category => (
                <li key={category.id} className="py-3">
                <Link href={`/products?category=${category.id}`} legacyBehavior>
                    <a className="text-gray-700 hover:text-green-600 transition-colors uppercase tracking-wider">{category.nome}</a>
                </Link>
                </li>
            ))}
            </ul>
        </div>
      </nav>
    </header>
  );
};