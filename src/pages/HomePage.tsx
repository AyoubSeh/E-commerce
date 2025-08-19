import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white p-8 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Découvrez nos meilleures offres
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Des milliers de produits de qualité à prix imbattables
            </p>
            <button className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Découvrir maintenant
            </button>
          </div>
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

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
         {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
