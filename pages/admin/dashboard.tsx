import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import type { Product, Category } from '../../types';
import { getServerSideProps } from '../../utils/withAuth';
import { supabase } from '../../utils/supabaseClient';

function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const productsResponse = await fetch('/api/products');
    const productsData = await productsResponse.json();
    setProducts(productsData);
    const categoriesResponse = await fetch('/api/categorias');
    const categoriesData = await categoriesResponse.json();
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const newSelection = new Set(selectedCategories);
    newSelection.has(categoryId) ? newSelection.delete(categoryId) : newSelection.add(categoryId);
    setSelectedCategories(newSelection);
  };

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setSelectedFiles([]);
    if (product) {
      setSelectedCategories(new Set(product.categorias.map(c => c.id)));
    } else {
      setSelectedCategories(new Set());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFiles([]);
    setSelectedCategories(new Set());
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    await fetch('/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: newCategoryName }),
    });
    setNewCategoryName('');
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);

    const formData = new FormData(event.currentTarget);
    let imageUrls = editingProduct?.imagens_url || [];

    if (selectedFiles.length > 0) {
      imageUrls = [];
      for (const file of selectedFiles) {
        const urlResponse = await fetch('/api/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name }),
        });
        const { token, path } = await urlResponse.json();
        const { error: uploadError } = await supabase.storage.from('imagens-produtos').uploadToSignedUrl(path, token, file);
        if (uploadError) {
          alert(`Erro ao fazer upload da imagem: ${file.name}`);
          setUploading(false);
          return;
        }
        const { data } = supabase.storage.from('imagens-produtos').getPublicUrl(path);
        imageUrls.push(data.publicUrl);
      }
    }

    const tamanhosString = formData.get('tamanhos') as string || '';
    const productData = {
      id: editingProduct?.id,
      nome: formData.get('nome'),
      descricao: formData.get('descricao'),
      preco: parseFloat(formData.get('preco') as string),
      imagens_url: imageUrls,
      tamanhos: tamanhosString.split(',').map(t => t.trim()).filter(t => t),
    };

    await fetch('/api/admin/save-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productData,
            selectedCategories: Array.from(selectedCategories),
            isEditing: !!editingProduct,
        }),
    });

    setUploading(false);
    closeModal();
    fetchData();
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
              <th className="py-3 px-6 text-left">Imagem Principal</th>
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Categorias</th>
              <th className="py-3 px-6 text-left">Preço</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  <img src={product.imagens_url?.[0] || '/placeholder.png'} alt={product.nome} className="w-12 h-12 object-cover rounded-md bg-gray-200" />
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{product.nome}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex flex-wrap gap-1">
                    {product.categorias.map(c => <span key={c.id} className="bg-gray-200 text-xs px-2 py-1 rounded-full">{c.nome}</span>)}
                  </div>
                </td>
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
      
      <div className="mt-16 bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-bold mb-4">Gerir Categorias</h2>
        <div className="flex items-center gap-4">
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome da nova categoria" className="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          <button onClick={handleSaveCategory} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Adicionar</button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Categorias existentes:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.length > 0 ? categories.map(cat => (
              <span key={cat.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{cat.nome}</span>
            )) : <p className="text-gray-500">Nenhuma categoria encontrada.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar' : 'Adicionar'} Produto</h2>
            <form onSubmit={handleSaveProduct}>
              {/* CAMPOS DO FORMULÁRIO QUE ESTAVAM EM FALTA ESTÃO AGORA AQUI */}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorias</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-2 rounded-md max-h-32 overflow-y-auto">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={selectedCategories.has(cat.id)} onChange={() => handleCategoryChange(cat.id)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>{cat.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="imagem" className="block text-sm font-medium text-gray-700">Imagens do Produto</label>
                <input type="file" name="imagem" id="imagem" accept="image/*" multiple onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedFiles.length > 0 ? selectedFiles.map((file, i) => (
                        <img key={i} src={URL.createObjectURL(file)} alt="Pré-visualização" className="w-20 h-20 object-cover rounded-md"/>
                    )) : editingProduct?.imagens_url?.map((url, i) => (
                        <img key={i} src={url} alt="Imagem atual" className="w-20 h-20 object-cover rounded-md"/>
                    ))}
                </div>
              </div>
              {/* FIM DOS CAMPOS DO FORMULÁRIO */}

              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">{uploading ? 'A guardar...' : 'Salvar'}</button>
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