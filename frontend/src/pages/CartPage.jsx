import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart, checkout } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-leather-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-leather-300 mb-4" />
          <h2 className="font-serif text-2xl text-leather-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-leather-600 mb-6">
            ¡Descubre nuestros productos de cuero de alta calidad!
          </p>
          <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leather-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-leather-900 mb-8">
          Tu Carrito
        </h1>

        <div className="bg-white rounded-sm shadow-md overflow-hidden">
          <div className="divide-y divide-leather-100">
            {items.map(item => {
              const discountedPrice = item.discount_percent > 0
                ? item.price * (1 - item.discount_percent / 100)
                : item.price;

              const imageUrl = item.image_url
                ? `${API_URL}${item.image_url}`
                : 'https://via.placeholder.com/100x100/8a4f3b/ffffff?text=Relux';

              return (
                <div key={item.id} className="p-4 md:p-6 flex gap-4">
                  <Link to={`/producto/${item.id}`} className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-sm"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/producto/${item.id}`}
                      className="font-serif text-lg font-medium text-leather-900 hover:text-leather-700"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="mt-1 flex items-center gap-2">
                      {item.discount_percent > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          -{item.discount_percent}%
                        </span>
                      )}
                      <span className="text-leather-600">
                        Gs. {discountedPrice.toLocaleString('es-PY')} c/u
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-leather-200 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-leather-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-leather-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-leather-900">
                      Gs. {(discountedPrice * item.quantity).toLocaleString('es-PY')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 md:p-6 bg-leather-50 border-t border-leather-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-leather-700">Total:</span>
              <span className="text-2xl font-bold text-leather-900">
                Gs. {getTotal().toLocaleString('es-PY')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearCart}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Vaciar carrito
              </button>
              <button
                onClick={checkout}
                className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Confirmar por WhatsApp
              </button>
            </div>

            <p className="text-sm text-leather-500 text-center mt-4">
              Al confirmar, serás redirigido a WhatsApp para finalizar tu pedido
            </p>
          </div>
        </div>

        <Link 
          to="/productos" 
          className="inline-flex items-center gap-2 text-leather-600 hover:text-leather-800 mt-6"
        >
          <ArrowLeft size={18} />
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
