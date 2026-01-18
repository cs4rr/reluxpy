import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Minus, Plus, Tag, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById } from '../api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error cargando producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-leather-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-leather-200 rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-leather-200 rounded-sm" />
              <div className="space-y-4">
                <div className="h-8 bg-leather-200 rounded w-3/4" />
                <div className="h-6 bg-leather-200 rounded w-1/4" />
                <div className="h-24 bg-leather-200 rounded" />
                <div className="h-12 bg-leather-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-leather-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-leather-900 mb-4">
            Producto no encontrado
          </h2>
          <Link to="/productos" className="btn-primary">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount_percent > 0
    ? product.price * (1 - product.discount_percent / 100)
    : null;

  const imageUrl = product.image_url
    ? `${API_URL}${product.image_url}`
    : 'https://via.placeholder.com/600x600/8a4f3b/ffffff?text=Relux';

  return (
    <div className="min-h-screen bg-leather-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <Link 
          to="/productos" 
          className="inline-flex items-center gap-2 text-leather-600 hover:text-leather-800 mb-8"
        >
          <ArrowLeft size={18} />
          Volver a productos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-white rounded-sm shadow-md overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Badges */}
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-sm">
                -{product.discount_percent}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-sm uppercase tracking-wider text-leather-500 mb-2">
              {product.category_name || 'Sin categoría'}
            </p>
            
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-leather-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              {discountedPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-leather-700">
                    Gs. {discountedPrice.toLocaleString('es-PY')}
                  </span>
                  <span className="text-xl text-leather-400 line-through">
                    Gs. {product.price.toLocaleString('es-PY')}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-leather-700">
                  Gs. {product.price.toLocaleString('es-PY')}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-leather-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {product.stock <= 5 
                    ? `¡Solo quedan ${product.stock} unidades!`
                    : 'En stock'}
                </p>
              ) : (
                <p className="text-red-600">Agotado</p>
              )}
            </div>

            {/* Wholesale Info */}
            {product.wholesale_price && (
              <div className="bg-gold-50 border border-gold-200 rounded-sm p-4 mb-6">
                <div className="flex items-center gap-2 text-gold-700 font-semibold mb-2">
                  <Users size={18} />
                  Precio Mayorista
                </div>
                <p className="text-leather-700">
                  Gs. {product.wholesale_price.toLocaleString('es-PY')} 
                  <span className="text-sm text-leather-500 ml-2">
                    (mínimo {product.wholesale_min_quantity} unidades)
                  </span>
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-6 mb-6">
                <span className="text-leather-700 font-medium">Cantidad:</span>
                <div className="flex items-center border border-leather-200 rounded-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-leather-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-3 hover:bg-leather-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-sm font-medium flex items-center justify-center gap-2 transition-all ${
                product.stock === 0
                  ? 'bg-leather-300 text-leather-500 cursor-not-allowed'
                  : addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-leather-700 text-white hover:bg-leather-800'
              }`}
            >
              <ShoppingBag size={20} />
              {product.stock === 0 
                ? 'Agotado' 
                : addedToCart 
                ? '¡Agregado!' 
                : 'Agregar al Carrito'}
            </button>

            {/* Tags */}
            {product.discount_percent > 0 && (
              <div className="mt-6 flex items-center gap-2">
                <Tag size={16} className="text-red-600" />
                <span className="text-sm text-leather-600">
                  ¡Aprovecha el {product.discount_percent}% de descuento!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
