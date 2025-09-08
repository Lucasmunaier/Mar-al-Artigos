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
  imagem_url: string;
  // Um produto agora tem uma LISTA de categorias
  categorias: Category[];
}