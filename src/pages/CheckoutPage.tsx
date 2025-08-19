import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  const handleCheckout = () => {
    navigate("/checkout"); // redirige vers la page Checkout
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      alert('Commande confirmée ! Redirection vers la page de confirmation...');
      clearCart();
      navigate('/');
      setProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Votre panier est vide
        </h1>
        <p className="text-gray-600 mb-8">
          Ajoutez des produits à votre panier pour procéder au paiement
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Continuer mes achats
        </button>
      </div>
    );
  }

  const totalWithTax = total + total * 0.2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Retour au panier</span>
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Finaliser votre commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">
                Informations de contact
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Adresse e-mail"
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Shipping Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">
                Adresse de livraison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="space-y-4 mt-4">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse"
                  className="input-field"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ville"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Code postal"
                    className="input-field"
                    required
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Informations de paiement
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Lock className="text-blue-600 mr-2" size={16} />
                  <p className="text-sm text-blue-800">
                    Le paiement sera sécurisé par Stripe
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                onClick={handleCheckout}
                className="w-full btn-primary text-lg py-3 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Payer {formatPrice(totalWithTax)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">
              Récapitulatif de la commande
            </h2>
            
            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-gray-500 text-xs">Qty: {quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatPrice(product.price * quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Frais de livraison</span>
                <span className="font-semibold text-success-600">Gratuit</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="font-semibold">{formatPrice(total * 0.2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600">
                    {formatPrice(totalWithTax)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Paiement sécurisé par
              </p>
              <div className="flex justify-center items-center space-x-2">
                <span className="bg-blue-600 text-white px-2 py-1 text-xs rounded">VISA</span>
                <span className="bg-red-600 text-white px-2 py-1 text-xs rounded">MASTERCARD</span>
                <span className="bg-gray-800 text-white px-2 py-1 text-xs rounded">STRIPE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;