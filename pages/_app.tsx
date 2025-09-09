import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/globals.css';
import { supabase } from '../utils/supabaseClient';
import type { Category } from '../types';

interface MyAppProps extends AppProps {
  categories: Category[];
}

function MyApp({ Component, pageProps, categories }: MyAppProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <Header categories={categories} />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { data: categories } = await supabase.from('categorias').select('*').order('nome');
  return { ...appProps, categories: categories || [] };
};

export default MyApp;