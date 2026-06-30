import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div className="card group flex flex-col overflow-hidden animate-fade-in">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist button */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur text-gray-600 shadow-sm opacity-0 group-hover:opacity-100 hover:text-accent-600 transition-all duration-300"
            aria-label="Ajouter aux favoris"
          >
            <Heart size={16} />
          </button>

          {/* Stock badges */}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-3 left-3 bg-warning-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              Stock limité
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 left-3 bg-error-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
              Rupture
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-yellow-400">
              <Star size={14} className="fill-current" />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full capitalize ml-auto">
              {product.category}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2">
            {product.description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="text-xl font-extrabold gradient-text">
            {formatPrice(product.price)}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Ajouter au panier"
            className={`h-10 w-10 grid place-items-center rounded-xl transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-brand-gradient hover:text-white hover:shadow-glow hover:-translate-y-0.5'
            }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        <a
          href={product.le_lien}
          className="btn-primary w-full mt-3 text-sm"
        >
          Acheter maintenant
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
