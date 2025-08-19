import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">Sehoul-Shop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre marketplace de confiance pour tous vos achats en ligne. 
              Découvrez des milliers de produits de qualité.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Produits</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Catégories</Link></li>
              <li><Link to="/deals" className="text-gray-400 hover:text-white">Promotions</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Client</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-400 hover:text-white">Centre d'aide</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white">Retours</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Livraison</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-400">ayoubsehoul1@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-400">+212 614767283</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github size={16} className="text-gray-400" />
                  <a href="https://github.com/AyoubSeh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline" >
              https://github.com/AyoubSeh </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Sehoul-shop. Tous droits réservés. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;