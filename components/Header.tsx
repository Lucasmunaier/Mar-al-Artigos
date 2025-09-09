import Link from 'next/link';
import { useRouter } from 'next/router';

export const Header = () => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage && router.pathname.endsWith('index')) {
    return null;
  }
  
  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" legacyBehavior>
          {/* NOME ALTERADO AQUI */}
          <a className="text-xl font-bold hover:text-green-400 transition-colors">
            Marçal Artigos Militares
          </a>
        </Link>
        
        {isAdminPage ? (
            <div>
                 <button 
                  onClick={async () => {
                    await fetch('/api/auth/logout');
                    router.push('/admin');
                  }}
                  className="px-4 py-2 hover:bg-gray-700 rounded transition-colors"
                >
                  Sair
                </button>
            </div>
        ) : (
          <div>
            <Link href="/" legacyBehavior>
              <a className="px-4 py-2 hover:bg-gray-700 rounded transition-colors">Home</a>
            </Link>
            <Link href="/products" legacyBehavior>
              <a className="px-4 py-2 hover:bg-gray-700 rounded transition-colors">Produtos</a>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};