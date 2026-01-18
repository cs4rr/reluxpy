import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '595971123456';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('relux_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('relux_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discount_percent > 0
        ? item.price * (1 - item.discount_percent / 100)
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';

    let message = '¡Hola! Me interesa realizar el siguiente pedido:\n\n';
    
    items.forEach(item => {
      const price = item.discount_percent > 0
        ? item.price * (1 - item.discount_percent / 100)
        : item.price;
      message += `• ${item.name} x${item.quantity} - Gs. ${(price * item.quantity).toLocaleString('es-PY')}\n`;
    });

    message += `\n*Total: Gs. ${getTotal().toLocaleString('es-PY')}*\n\n`;
    message += 'Por favor, confirmar disponibilidad. ¡Gracias!';

    return message;
  };

  const checkout = () => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
