import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import type { Product, Category } from '../../types';
import { getServerSideProps } from '../../utils/withAuth';
import { supabase } from '../../utils/supabaseClient';

// Adicionamos a nova propriedade ao tipo Product para uso interno neste componente
interface AdminProduct extends Product {
  em_destaque?: boolean;
}

function AdminDashboard() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const productsResponse = await fetch('/api/products');
    const productsData = await productsResponse.json();
    setProducts(productsData || []);
    const categoriesResponse = await fetch('/api/categorias');
    const categoriesData = await categoriesResponse.json();
    setCategories(categoriesData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleCategoryChange = (categoryId: string) => {
    const newSelection = new Set(selectedCategories);
    newSelection.has(categoryId) ? newSelection.delete(categoryId) : newSelection.add(categoryId);
    setSelectedCategories(newSelection);
  };

  const openModal = (product: AdminProduct | null = null) => {
    setEditingProduct(product);
    setSelectedFiles([]);
    if (product) {
      setSelectedCategories(new Set(product.categorias.map(c => c.id)));
    } else {
      setSelectedCategories(new Set());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSaveCategory = async () => { /* ...código existente sem alterações... */ };
  const handleDeleteProduct = async (id: string) => { /* ...código existente sem alterações... */ };

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
      em_destaque: formData.get('em_destaque') === 'on', // Captura o valor do novo checkbox
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
              <th className="py-3 px-6 text-left">Imagem</th>
              <th className="py-3 px-6 text-left">Nome</th>
              <th className="py-3 px-6 text-left">Destaque</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  <img src={product.imagens_url?.[0] || '/placeholder.png'} alt={product.nome} className="w-12 h-12 object-cover rounded-md bg-gray-200" />
                </td>
                <td className="py-3 px-6 text-left font-medium">{product.nome}</td>
                <td className="py-3 px-6 text-left">
                  {product.em_destaque ? <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Sim</span> : 'Não'}
                </td>
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
        {/* ... (O JSX de gestão de categorias continua igual) ... */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar' : 'Adicionar'} Produto</h2>
            <form onSubmit={handleSaveProduct}>
              {/* ... (campos nome, descrição, preço, tamanhos, categorias e imagens continuam iguais) ... */}
              
              {/* O novo checkbox para marcar como destaque */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="em_destaque" 
                    defaultChecked={editingProduct?.em_destaque}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Marcar como destaque na página principal</span>
                </label>
              </div>

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