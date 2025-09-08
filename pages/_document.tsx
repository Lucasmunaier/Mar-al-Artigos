import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* A linha abaixo adiciona o seu ícone à aba do navegador */}
        <link rel="icon" href="/icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://unpkg.com/flowbite@1.5.1/dist/flowbite.js"></script>
      </body>
    </Html>
  );
}