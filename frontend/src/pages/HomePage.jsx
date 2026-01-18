import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, Shield } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ active_only: 'true' }),
        getCategories()
      ]);
      setFeaturedProducts(productsRes.data.slice(0, 4));
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-leather-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-leather-950/90 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <span className="inline-block text-gold-400 text-sm uppercase tracking-widest mb-4">
              Accesorios diarios
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Elegancia que <br />
              <span className="text-gold-400">perdura</span> en el tiempo
            </h1>
            <p className="text-leather-200 text-lg mb-8">
              Descubre nuestra colección de Productos, 
              elaborados con dedicación para quienes valoran la calidad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
                Ver Colección <ArrowRight size={18} />
              </Link>
              <Link to="/contacto" className="btn-secondary text-white border-white hover:bg-white hover:text-leather-900">
                Contactanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-leather-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-leather-100 rounded-full">
                <Package size={28} className="text-leather-700" />
              </div>
              <div>
                <h3 className="font-semibold text-leather-900">Cuero Genuino</h3>
                <p className="text-sm text-leather-600">100% cuero de alta calidad</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-leather-100 rounded-full">
                <Truck size={28} className="text-leather-700" />
              </div>
              <div>
                <h3 className="font-semibold text-leather-900">Envíos a Todo el País</h3>
                <p className="text-sm text-leather-600">Entregas rápidas y seguras</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-leather-100 rounded-full">
                <Shield size={28} className="text-leather-700" />
              </div>
              <div>
                <h3 className="font-semibold text-leather-900">Garantía de Calidad</h3>
                <p className="text-sm text-leather-600">Satisfacción garantizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-leather-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-leather-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-leather-600 max-w-2xl mx-auto">
              Explora nuestra variedad de productos artesanales de cuero
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/productos?categoria=${category.slug}`}
                className="group relative aspect-square overflow-hidden rounded-sm bg-leather-800"
              >
                {category.image_url && (
                  <img 
                    src={category.image_url} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-leather-950 via-leather-950/50 to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-leather-300 group-hover:text-gold-300 transition-colors inline-flex items-center gap-1 mt-2">
                      Ver productos <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl font-bold text-leather-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-leather-600">
                Lo mejor de nuestra colección
              </p>
            </div>
            <Link 
              to="/productos" 
              className="hidden md:inline-flex items-center gap-2 text-leather-700 hover:text-gold-600 transition-colors"
            >
              Ver todos <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-leather-200 rounded-sm" />
                  <div className="mt-4 h-4 bg-leather-200 rounded w-1/2" />
                  <div className="mt-2 h-6 bg-leather-200 rounded" />
                  <div className="mt-2 h-4 bg-leather-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-leather-600">
              <p>No hay productos disponibles todavía.</p>
              <p className="text-sm mt-2">¡Pronto agregaremos nuevos productos!</p>
            </div>
          )}

          <div className="md:hidden text-center mt-8">
            <Link to="/productos" className="btn-secondary inline-flex items-center gap-2">
              Ver todos los productos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-leather-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Buscas algo especial?
          </h2>
          <p className="text-leather-200 text-lg mb-8">
            Ofrecemos servicios de grabado personalizado para hacer tu 
            producto único. Contactanos para más información.
          </p>
          <Link to="/contacto" className="btn-gold inline-flex items-center gap-2">
            Contactar ahora <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
