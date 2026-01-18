import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, LogOut, Search, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getCategories, deleteProduct, updateProduct } from '../../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setDeleteModal(null);
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const formData = new FormData();
      formData.append('is_active', !product.is_active);
      await updateProduct(product.id, formData);
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-leather-100">
      {/* Header */}
      <header className="bg-leather-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-serif text-2xl font-bold text-gold-400">
              RELUX
            </Link>
            <span className="text-leather-400 text-sm">Panel Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-leather-300">{admin?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-leather-300 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-leather-100 rounded-full">
                <Package size={24} className="text-leather-700" />
              </div>
              <div>
                <p className="text-sm text-leather-500">Total Productos</p>
                <p className="text-2xl font-bold text-leather-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Eye size={24} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm text-leather-500">Productos Activos</p>
                <p className="text-2xl font-bold text-leather-900">
                  {products.filter(p => p.is_active).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gold-100 rounded-full">
                <Package size={24} className="text-gold-700" />
              </div>
              <div>
                <p className="text-sm text-leather-500">Con Descuento</p>
                <p className="text-2xl font-bold text-leather-900">
                  {products.filter(p => p.discount_percent > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="bg-white rounded-sm shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-leather-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field sm:w-48"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Link
              to="/admin/producto/nuevo"
              className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plus size={18} />
              Nuevo Producto
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-leather-500">Cargando...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-leather-500">
              No se encontraron productos
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-leather-50 border-b border-leather-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-leather-700">Producto</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-leather-700">Categoría</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-leather-700">Precio</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-leather-700">Stock</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-leather-700">Estado</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-leather-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-leather-100">
                  {filteredProducts.map(product => {
                    const imageUrl = product.image_url
                      ? `${API_URL}${product.image_url}`
                      : 'https://via.placeholder.com/60x60/8a4f3b/ffffff?text=R';
                    
                    return (
                      <tr key={product.id} className="hover:bg-leather-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-sm"
                            />
                            <div>
                              <p className="font-medium text-leather-900">{product.name}</p>
                              {product.discount_percent > 0 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                  -{product.discount_percent}%
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-leather-600">
                          {product.category_name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-leather-900">
                            Gs. {product.price.toLocaleString('es-PY')}
                          </p>
                          {product.wholesale_price && (
                            <p className="text-xs text-gold-600">
                              Mayorista: Gs. {product.wholesale_price.toLocaleString('es-PY')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            product.stock === 0 ? 'text-red-600' :
                            product.stock <= 5 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`flex items-center gap-1 text-sm px-2 py-1 rounded-sm transition-colors ${
                              product.is_active
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-leather-100 text-leather-500 hover:bg-leather-200'
                            }`}
                          >
                            {product.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                            {product.is_active ? 'Activo' : 'Oculto'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/producto/${product.id}`}
                              className="p-2 text-leather-600 hover:text-leather-900 hover:bg-leather-100 rounded-sm transition-colors"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() => setDeleteModal(product)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full p-6">
            <h3 className="font-serif text-xl font-bold text-leather-900 mb-4">
              ¿Eliminar producto?
            </h3>
            <p className="text-leather-600 mb-6">
              ¿Estás seguro de que deseas eliminar "{deleteModal.name}"? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteModal.id)}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
