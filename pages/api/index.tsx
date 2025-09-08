import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container mx-auto px-6 text-center flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Bem-vindo à Tático Store</h2>
        <p className="text-lg text-gray-600 mb-8">Equipamentos e artigos militares de alta performance.</p>
        <Link href="/products" legacyBehavior>
          <a className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
            Ver Produtos
          </a>
        </Link>
      </div>
    </main>
  );
}