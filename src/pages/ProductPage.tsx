import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedProduct = await productService.getProductById(id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        // For demo, use mock data
        const mockProduct = mockProducts.find(p => p.id === id);
        setProduct(mockProduct || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Produit introuvable
        </h1>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Deterministic review count (stable across re-renders)
  const reviewCount = 80 + Math.round(product.rating * 180) + (product.name.length * 17) % 700;

  // Mock multiple images for demo
  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Retour</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Images */}
        <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-card">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-600 ring-2 ring-primary-100'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block text-xs font-medium text-primary-700 bg-primary-50 px-3 py-1 rounded-full capitalize mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.rating.toFixed(1)}) • {reviewCount} avis
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-5">
              {formatPrice(product.price)}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            product.stock > 10 ? 'bg-success-50 text-success-600' :
            product.stock > 0 ? 'bg-warning-50 text-warning-600' :
            'bg-error-50 text-error-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              product.stock > 10 ? 'bg-success-500' :
              product.stock > 0 ? 'bg-warning-500' :
              'bg-error-500'
            }`} />
            {product.stock > 10 ? 'En stock' :
             product.stock > 0 ? `Plus que ${product.stock} en stock` :
             'Rupture de stock'}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Quantité</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="px-5 py-2.5 border-x border-gray-200 font-medium min-w-[56px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="btn-primary flex-1 text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Acheter — {formatPrice(product.price * quantity)}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-secondary flex-1 text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} className="mr-2" />
              Ajouter au panier
            </button>
          </div>

          {/* Additional Actions */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Heart size={20} />
              <span>Ajouter aux favoris</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Share size={20} />
              <span>Partager</span>
            </button>
          </div>

          {/* Product Details */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Détails du produit</h3>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <dt className="text-xs text-gray-500 mb-1">Catégorie</dt>
                <dd className="text-gray-900 font-medium capitalize">{product.category}</dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <dt className="text-xs text-gray-500 mb-1">Stock</dt>
                <dd className="text-gray-900 font-medium">{product.stock} unités</dd>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <dt className="text-xs text-gray-500 mb-1">SKU</dt>
                <dd className="text-gray-900 font-medium truncate">#{product.id.slice(0, 8).toUpperCase()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock products for demo
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Le dernier iPhone avec une caméra révolutionnaire et la puce A17 Pro. Profitez d\'une expérience photographique exceptionnelle avec le nouveau système de caméras Pro, d\'une performance incroyable pour tous vos besoins et d\'une autonomie qui dure toute la journée.',
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

export default ProductPage;