import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product } from '../types';
import { productService } from '../services/productService';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search');

  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'electronics', name: 'Électronique' },
    { id: 'clothing', name: 'Vêtements' },
    { id: 'home', name: 'Maison' },
    { id: 'books', name: 'Livres' },
    { id: 'sports', name: 'Sport' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let fetchedProducts: Product[];

        if (searchQuery) {
          fetchedProducts = await productService.searchProducts(searchQuery);
        } else if (selectedCategory === 'all') {
          fetchedProducts = await productService.getAllProducts();
        } else {
          fetchedProducts = await productService.getProductsByCategory(selectedCategory);
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // For demo purposes, use mock data
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      {!searchQuery && (
        <div className="relative overflow-hidden bg-brand-gradient rounded-3xl text-white p-8 sm:p-12 mb-10 shadow-glow">
          {/* Decorative blurred circles */}
          <div className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 bg-accent-500/30 rounded-full blur-3xl" />
          <div className="relative max-w-2xl animate-slide-up">
            <span className="inline-block bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-3 py-1 rounded-full mb-4">
              ✨ Nouveautés chaque semaine
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Découvrez nos meilleures offres
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mb-8">
              Des milliers de produits de qualité à prix imbattables
            </p>
            <button className="bg-white text-primary-700 font-semibold py-3 px-7 rounded-xl shadow-lg hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-200">
              Découvrir maintenant
            </button>
          </div>
        </div>
      )}

      {/* Trust / Features strip */}
      {!searchQuery && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Truck, title: 'Livraison gratuite', desc: 'Dès 50 € d\'achat' },
            { icon: ShieldCheck, title: 'Paiement sécurisé', desc: 'Via Stripe' },
            { icon: RotateCcw, title: 'Retours 30 jours', desc: 'Satisfait ou remboursé' },
            { icon: Headphones, title: 'Support 7j/7', desc: 'Une équipe à l\'écoute' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-11 w-11 shrink-0 grid place-items-center rounded-xl bg-primary-50 text-primary-600">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{title}</p>
                <p className="text-gray-500 text-xs truncate">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Résultats pour "{searchQuery}"
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Section header */}
      {!searchQuery && (
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Nos produits
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} article{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
         {products.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }} className="animate-slide-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
            {searchQuery 
              ? `Aucun produit trouvé pour "${searchQuery}"`
              : 'Aucun produit disponible dans cette catégorie'
            }
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              window.history.replaceState({}, '', '/');
            }}
            className="btn-primary"
          >
            Voir tous les produits
          </button>
        </div>
      )}
    </div>
  );
};

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Le dernier iPhone avec une caméra révolutionnaire et la puce A17 Pro.',
    price: 1199,
    image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    stock: 15,
    category: 'electronics',
    rating: 4.8,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'MacBook Air M2',
    description: 'Ultrabook performant avec la puce Apple M2 et jusqu\'à 18h d\'autonomie.',
    price: 1299,
    image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    stock: 8,
    category: 'electronics',
    rating: 4.9,
    created_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'T-shirt Premium Cotton',
    description: 'T-shirt en coton bio de qualité supérieure, confortable et durable.',
    price: 29.99,
    image_url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    stock: 50,
    category: 'clothing',
    rating: 4.5,
    created_at: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Casque Audio Sans Fil',
    description: 'Casque Bluetooth avec réduction de bruit active et 30h d\'autonomie.',
    price: 199.99,
    image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    stock: 25,
    category: 'electronics',
    rating: 4.7,
    created_at: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Chaise de Bureau Ergonomique',
    description: 'Chaise de bureau confortable avec support lombaire et accoudoirs ajustables.',
    price: 249.99,
    image_url: 'https://images.pexels.com/photos/2403251/pexels-photo-2403251.jpeg',
    stock: 12,
    category: 'home',
    rating: 4.6,
    created_at: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Livre: "Le Petit Prince"',
    description: 'Le classique de Saint-Exupéry, édition illustrée de collection.',
    price: 15.99,
    image_url: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
    stock: 100,
    category: 'books',
    rating: 4.9,
    created_at: '2024-01-06T00:00:00Z',
  },
];

export default HomePage;
