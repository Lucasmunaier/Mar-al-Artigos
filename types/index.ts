export interface Category {
  id: string;
  nome: string;
}

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tamanhos: string[];
  // Alteração aqui:
  imagens_url: string[]; // De imagem_url (string) para imagens_url (array de strings)
  categorias: Category[];
}