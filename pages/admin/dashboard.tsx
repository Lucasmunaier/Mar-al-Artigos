import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import type { Product, Category } from '../../types';
import { getServerSideProps } from '../../utils/withAuth';
import { supabase } from '../../utils/supabaseClient';

function AdminDashboard() {
  // Estados para dados
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Estados para UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Estados para o upload de imagem
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Função para buscar todos os dados iniciais
  const fetchData = async () => {
    // Buscar produtos
    const productsResponse = await fetch('/api/products');
    const productsData = await productsResponse.json();
    setProducts(productsData);

    // Buscar categorias
    const categoriesResponse = await fetch('/api/categorias');
    const categoriesData = await categoriesResponse.json();
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Abre o modal para criar ou editar um produto
  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // Fecha o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
  };

  // Lida com a seleção de um ficheiro de imagem
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Salva uma nova categoria
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: newCategoryName }),
    });
    setNewCategoryName('');
    fetchData(); // Recarrega os dados
  };
  
  // Apaga um produto
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData(); // Recarrega os dados
    }
  };

  // Salva um produto (cria um novo ou edita um existente)
const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);

    const formData = new FormData(event.currentTarget);
    let imageUrl = editingProduct?.imagem_url || '';

    if (selectedFile) {
      // Pede o token e o caminho à nossa API
      const urlResponse = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: selectedFile.name }),
      });
      // A MUDANÇA ESTÁ AQUI: Recebemos token e path
      const { token, path } = await urlResponse.json();

      // E AQUI: Usamos o token e o path para fazer o upload
      const { error: uploadError } = await supabase.storage
        .from('imagens-produtos')
        .uploadToSignedUrl(path, token, selectedFile); // Corrigido!
      
      if (uploadError) {
        alert('Erro ao fazer upload da imagem.');
        console.error(uploadError);
        setUploading(false);
        return;
      }
      
      const { data } = supabase.storage.from('imagens-produtos').getPublicUrl(path);
      imageUrl = data.publicUrl;
    }
    
    // 2. Prepara os dados do produto para serem guardados
    const tamanhosString = formData.get('tamanhos') as string || '';
    const tamanhosArray = tamanhosString.split(',').map(t => t.trim()).filter(t => t);

    const productData = {
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      preco: parseFloat(formData.get('preco') as string),
      imagem_url: imageUrl,
      categoria_id: formData.get('categoria_id'),
      tamanhos: tamanhosArray,
    };
    
    // 3. Envia os dados para a API para guardar no banco de dados
    const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    setUploading(false);
    closeModal();
    fetchData(); // Recarrega os dados
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Secção de Produtos */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerir Produtos</h1>
        <button onClick={() => openModal()} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Adicionar Produto
        </button>
      </div>

      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Imagem</th>
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Categoria</th>
              <th className="py-3 px-6 text-left">Preço</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  <img src={product.imagem_url} alt={product.nome} className="w-12 h-12 object-cover rounded-md" />
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{product.nome}</td>
                <td className="py-3 px-6 text-left">{product.categoria?.nome || 'Sem categoria'}</td>
                <td className="py-3 px-6 text-left">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    <button onClick={() => openModal(product)} className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 hover:bg-blue-600" title="Editar">✏️</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600" title="Excluir">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Secção de Categorias */}
      <div className="mt-16 bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-bold mb-4">Gerir Categorias</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria"
            className="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button onClick={handleSaveCategory} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Adicionar
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Categorias existentes:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.length > 0 ? categories.map(cat => (
              <span key={cat.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {cat.nome}
              </span>
            )) : <p className="text-gray-500">Nenhuma categoria encontrada.</p>}
          </div>
        </div>
      </div>

      {/* Modal para Adicionar/Editar Produto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar' : 'Adicionar'} Produto</h2>
            <form onSubmit={handleSaveProduct}>
              <div className="mb-4">
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" name="nome" id="nome" defaultValue={editingProduct?.nome} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea name="descricao" id="descricao" defaultValue={editingProduct?.descricao} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço (ex: 123.45)</label>
                <input type="number" step="0.01" name="preco" id="preco" defaultValue={editingProduct?.preco} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="tamanhos" className="block text-sm font-medium text-gray-700">Tamanhos (separados por vírgula)</label>
                <input type="text" name="tamanhos" id="tamanhos" defaultValue={editingProduct?.tamanhos?.join(', ')} placeholder="P, M, G, 42, 43" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="categoria_id" className="block text-sm font-medium text-gray-700">Categoria</label>
                <select name="categoria_id" id="categoria_id" defaultValue={editingProduct?.categoria_id} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
                <input type="file" name="imagem" id="imagem" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                {selectedFile ? (
                    <img src={URL.createObjectURL(selectedFile)} alt="Pré-visualização" className="mt-4 w-32 h-32 object-cover rounded-md"/>
                ) : editingProduct?.imagem_url && (
                    <img src={editingProduct.imagem_url} alt="Imagem atual" className="mt-4 w-32 h-32 object-cover rounded-md"/>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                  {uploading ? 'A guardar...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { getServerSideProps };
export default AdminDashboard;