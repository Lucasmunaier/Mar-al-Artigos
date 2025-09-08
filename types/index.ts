export interface Category {
  id: string;
  nome: string;
}

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tamanhos: string[]; // Alterado de tamanho para tamanhos (array)
  imagem_url: string;
  categoria_id: string;
  // Este campo virá da nossa consulta à API
  categoria?: {
    nome: string;
  };
}