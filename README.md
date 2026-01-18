# Relux - E-Shop de Productos de Cuero

E-commerce para la venta de productos de cuero con panel de administración.

## Tecnologías

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** SQLite (sql.js)
- **Checkout:** WhatsApp

## Estructura del Proyecto

```
relux/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── api/       # Configuración de API
│   │   ├── components/# Componentes reutilizables
│   │   ├── context/   # Context de Auth y Cart
│   │   └── pages/     # Páginas de la app
│   └── ...
├── backend/           # Express + SQLite
│   ├── config/        # Configuración de DB
│   ├── middleware/    # Auth middleware
│   ├── routes/        # API routes
│   └── uploads/       # Imágenes de productos
└── README.md
```

## Instalación y Ejecución

### 1. Clonar e instalar dependencias

```bash
# Backend
cd relux/backend
npm install

# Frontend
cd relux/frontend
npm install
```

### 2. Configurar variables de entorno

**Backend (.env):**
```env
PORT=3001
JWT_SECRET=tu_clave_secreta_aqui
ADMIN_EMAIL=admin@relux.com
ADMIN_PASSWORD=admin123
WHATSAPP_NUMBER=595971123456
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001
VITE_WHATSAPP_NUMBER=595971123456
```

### 3. Ejecutar en desarrollo

En dos terminales separadas:

```bash
# Terminal 1 - Backend
cd relux/backend
npm start
# Servidor en http://localhost:3001

# Terminal 2 - Frontend
cd relux/frontend
npm run dev
# App en http://localhost:5173
```

## Credenciales Admin por Defecto

- **Email:** admin@relux.com
- **Password:** admin123

## Funcionalidades

### Públicas
- ✅ Catálogo de productos con filtros por categoría
- ✅ Detalle de producto con descuentos y precio mayorista
- ✅ Carrito de compras persistente
- ✅ Checkout vía WhatsApp
- ✅ Página de contacto

### Administración
- ✅ Login seguro con JWT
- ✅ CRUD completo de productos
- ✅ Subida de imágenes
- ✅ Gestión de precios (normal y mayorista)
- ✅ Tags de descuento
- ✅ Control de stock
- ✅ Activar/desactivar productos

## Categorías Pre-configuradas

Las siguientes categorías se crean automáticamente al iniciar el backend por primera vez:

1. Billeteras con Tarjetero
2. Tarjeteros
3. Relojes
4. Grabados

Cada categoría viene con una imagen de Unsplash por defecto. El admin puede agregar más categorías desde el código si es necesario.

## API Endpoints

### Auth
- `POST /api/auth/login` - Login admin
- `GET /api/auth/verify` - Verificar token

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:slug` - Obtener categoría

## Deploy Gratuito

### Frontend (Vercel o Netlify)
1. Conectar repositorio
2. Build command: `npm run build`
3. Output directory: `dist`
4. Configurar variables de entorno

### Backend (Render o Railway)
1. Conectar repositorio
2. Build command: `npm install`
3. Start command: `npm start`
4. Configurar variables de entorno

## Próximas Mejoras (Sugeridas)

- [ ] Múltiples imágenes por producto
- [ ] Sistema de usuarios/clientes
- [ ] Historial de pedidos
- [ ] Pasarela de pagos
- [ ] Sistema de reviews
- [ ] Dashboard con estadísticas

---

Desarrollado con ❤️ para Relux
