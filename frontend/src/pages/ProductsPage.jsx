import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../api';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('categoria') || '';

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = { active_only: 'true' };
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      const { data } = await getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug) => {
    if (slug) {
      setSearchParams({ categoria: slug });
    } else {
      setSearchParams({});
    }
    setShowFilters(false);
  };

  const getCategoryName = () => {
    if (!selectedCategory) return 'Todos los Productos';
    const cat = categories.find(c => c.slug === selectedCategory);
    return cat ? cat.name : 'Productos';
  };

  return (
    <div className="min-h-screen bg-leather-50">
      {/* Header */}
      <div className="bg-leather-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-white text-center">
            {getCategoryName()}
          </h1>
          <p className="text-leather-300 text-center mt-2">
            Descubre nuestra colección de productos de cuero
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-sm shadow-sm p-6 sticky top-24">
              <h3 className="font-serif text-lg font-semibold text-leather-900 mb-4">
                Categorías
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left py-2 px-3 rounded-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-leather-700 text-white'
                        : 'text-leather-600 hover:bg-leather-100'
                    }`}
                  >
                    Todos los Productos
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`w-full text-left py-2 px-3 rounded-sm transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-leather-700 text-white'
                          : 'text-leather-600 hover:bg-leather-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Filter size={18} /> Filtrar por categoría
            </button>
          </div>

          {/* Mobile Filter Modal */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-serif text-lg font-semibold">Categorías</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>
                <ul className="p-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left py-3 px-4 rounded-sm transition-colors ${
                        !selectedCategory
                          ? 'bg-leather-700 text-white'
                          : 'text-leather-600 hover:bg-leather-100'
                      }`}
                    >
                      Todos los Productos
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryChange(category.slug)}
                        className={`w-full text-left py-3 px-4 rounded-sm transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-leather-700 text-white'
                            : 'text-leather-600 hover:bg-leather-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {selectedCategory && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-leather-600">Filtrado por:</span>
                <span className="inline-flex items-center gap-1 bg-leather-700 text-white text-sm px-3 py-1 rounded-full">
                  {getCategoryName()}
                  <button onClick={() => handleCategoryChange('')}>
                    <X size={14} />
                  </button>
                </span>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-leather-200 rounded-sm" />
                    <div className="mt-4 h-4 bg-leather-200 rounded w-1/2" />
                    <div className="mt-2 h-6 bg-leather-200 rounded" />
                    <div className="mt-2 h-4 bg-leather-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-leather-600 text-lg">
                  No hay productos en esta categoría.
                </p>
                <button
                  onClick={() => handleCategoryChange('')}
                  className="btn-primary mt-4"
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
