import { useRouter } from 'next/router';

export const Footer = () => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const whatsappNumber = '55SEUNUMERO'; // Substitua pelo seu número

  // Não renderiza o footer nas páginas de admin
  if (isAdminPage) {
    return null;
  }

  return (
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
};