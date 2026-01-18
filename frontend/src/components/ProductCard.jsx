import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const discountedPrice = product.discount_percent > 0
    ? product.price * (1 - product.discount_percent / 100)
    : null;

  const imageUrl = product.image_url
    ? `${API_URL}${product.image_url}`
    : 'https://via.placeholder.com/400x400/8a4f3b/ffffff?text=Relux';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
  };

  return (
    <div className="card group">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-leather-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          {product.discount_percent > 0 && (
            <span className="badge-discount">
              -{product.discount_percent}%
            </span>
          )}
          {product.wholesale_price && (
            <span className="badge-wholesale">
              Mayorista
            </span>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-leather-900/0 group-hover:bg-leather-900/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="p-3 bg-white rounded-full text-leather-900 hover:bg-gold-400 transition-colors"
              title="Agregar al carrito"
            >
              <ShoppingBag size={20} />
            </button>
            <Link
              to={`/producto/${product.id}`}
              className="p-3 bg-white rounded-full text-leather-900 hover:bg-gold-400 transition-colors"
              title="Ver detalles"
            >
              <Eye size={20} />
            </Link>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wider text-leather-500 mb-1">
            {product.category_name || 'Sin categoría'}
          </p>
          <h3 className="font-serif text-lg font-medium text-leather-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {discountedPrice ? (
              <>
                <span className="text-lg font-semibold text-leather-700">
                  Gs. {discountedPrice.toLocaleString('es-PY')}
                </span>
                <span className="text-sm text-leather-400 line-through">
                  Gs. {product.price.toLocaleString('es-PY')}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-leather-700">
                Gs. {product.price.toLocaleString('es-PY')}
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-red-600 mt-2">
              ¡Solo quedan {product.stock} unidades!
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600 mt-2 font-medium">
              Agotado
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
