import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useUser, useClerk , SignedIn, SignedOut, SignInButton , UserButton } from '@clerk/clerk-react';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
   const user = useUser();
  const clerk = useClerk();
   const auth = () => {
    if (user.isSignedIn) {
      clerk.signOut();
    }
    
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const itemCount = getItemCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Sehoul-Shop</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
               <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => auth()}>
                <User size={20} />
                <span>Sign up / in </span>
              </button>
            </SignInButton>   
            </SignedOut>
            <SignedIn>
          <UserButton />
          </SignedIn>
            <Link
              to="/cart"
              className="relative flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>Panier</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            <div className="space-y-2">
              <SignedOut>
            <SignInButton>
              <button className="flex items-center space-x-2 w-full py-2 text-gray-700">
                <User size={20} />
                <span>Mon Compte</span>
              </button>
              </SignInButton>   
            </SignedOut>
            <SignedIn>
          <UserButton />
          </SignedIn>

              <Link
                to="/cart"
                className="flex items-center justify-between w-full py-2 text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCart size={20} />
                  <span>Panier</span>
                </div>
                {itemCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;