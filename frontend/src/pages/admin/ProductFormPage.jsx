import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import { getProductById, getCategories, createProduct, updateProduct } from '../../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'nuevo';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    wholesale_price: '',
    wholesale_min_quantity: '1',
    stock: '0',
    discount_percent: '0',
    category_id: '',
    is_active: true
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await getProductById(id);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        wholesale_price: data.wholesale_price?.toString() || '',
        wholesale_min_quantity: data.wholesale_min_quantity?.toString() || '1',
        stock: data.stock?.toString() || '0',
        discount_percent: data.discount_percent?.toString() || '0',
        category_id: data.category_id?.toString() || '',
        is_active: data.is_active
      });
      if (data.image_url) {
        setImagePreview(`${API_URL}${data.image_url}`);
      }
    } catch (error) {
      console.error('Error cargando producto:', error);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (formData.wholesale_price) {
        data.append('wholesale_price', formData.wholesale_price);
      }
      data.append('wholesale_min_quantity', formData.wholesale_min_quantity);
      data.append('stock', formData.stock);
      data.append('discount_percent', formData.discount_percent);
      if (formData.category_id) {
        data.append('category_id', formData.category_id);
      }
      data.append('is_active', formData.is_active);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error guardando producto:', error);
      setError(error.response?.data?.error || 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-leather-100 flex items-center justify-center">
        <div className="text-leather-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leather-100">
      {/* Header */}
      <header className="bg-leather-900 text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/admin" className="text-leather-300 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <Link to="/" className="font-serif text-2xl font-bold text-gold-400">
              RELUX
            </Link>
            <span className="text-leather-400 text-sm ml-4">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-sm shadow-sm p-6 md:p-8">
          <h1 className="font-serif text-2xl font-bold text-leather-900 mb-6">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-leather-700 mb-2">
                Imagen del producto
              </label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-sm border border-leather-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 border-2 border-dashed border-leather-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-leather-500 transition-colors">
                    <Upload size={24} className="text-leather-400" />
                    <span className="text-xs text-leather-500 mt-1">Subir imagen</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="text-sm text-leather-500">
                  <p>Formatos: JPG, PNG, WebP</p>
                  <p>Tamaño máximo: 5MB</p>
                </div>
              </div>
            </div>

            {/* Nombre y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-leather-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ej: Billetera de Cuero Premium"
                />
              </div>
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-leather-700 mb-2">
                  Categoría
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-leather-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                placeholder="Describe las características del producto..."
              />
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-leather-700 mb-2">
                  Precio (Gs.) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="150000"
                />
              </div>
              <div>
                <label htmlFor="wholesale_price" className="block text-sm font-medium text-leather-700 mb-2">
                  Precio Mayorista (Gs.)
                </label>
                <input
                  type="number"
                  id="wholesale_price"
                  name="wholesale_price"
                  value={formData.wholesale_price}
                  onChange={handleChange}
                  min="0"
                  className="input-field"
                  placeholder="120000"
                />
              </div>
              <div>
                <label htmlFor="wholesale_min_quantity" className="block text-sm font-medium text-leather-700 mb-2">
                  Mínimo Mayorista
                </label>
                <input
                  type="number"
                  id="wholesale_min_quantity"
                  name="wholesale_min_quantity"
                  value={formData.wholesale_min_quantity}
                  onChange={handleChange}
                  min="1"
                  className="input-field"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Stock y Descuento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-leather-700 mb-2">
                  Stock disponible
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="input-field"
                  placeholder="50"
                />
              </div>
              <div>
                <label htmlFor="discount_percent" className="block text-sm font-medium text-leather-700 mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  id="discount_percent"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-leather-300 text-leather-700 focus:ring-leather-500"
              />
              <label htmlFor="is_active" className="text-sm text-leather-700">
                Producto activo (visible en la tienda)
              </label>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-leather-100">
              <Link to="/admin" className="btn-secondary flex-1 text-center">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
