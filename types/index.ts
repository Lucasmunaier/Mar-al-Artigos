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
  // Alteração aqui: de uma imagem para várias
  imagens_url: string[]; 
  categorias: Category[];
}