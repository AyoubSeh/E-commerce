import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  CreditCard,
  CheckCircle2,
  Check,
  Lock,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

type StepId = 1 | 2 | 3 | 4;

const STEPS: { id: StepId; label: string; icon: React.ElementType }[] = [
  { id: 1, label: 'Panier', icon: ShoppingBag },
  { id: 2, label: 'Livraison', icon: Truck },
  { id: 3, label: 'Paiement', icon: CreditCard },
  { id: 4, label: 'Confirmation', icon: CheckCircle2 },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

/* ---------- Stepper ---------- */
const Stepper: React.FC<{ current: StepId }> = ({ current }) => (
  <div className="flex items-start mb-10">
    {STEPS.map((s, i) => {
      const done = s.id < current;
      const active = s.id === current;
      const Icon = s.icon;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center w-16 sm:w-28 shrink-0">
            <div
              className={`h-11 w-11 grid place-items-center rounded-full font-semibold transition-all duration-300 ${
                done
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : active
                  ? 'bg-brand-gradient text-white shadow-glow ring-4 ring-primary-100'
                  : 'bg-white border-2 border-gray-200 text-gray-400'
              }`}
            >
              {done ? <Check size={20} /> : <Icon size={20} />}
            </div>
            <span
              className={`mt-2 text-[11px] sm:text-sm font-medium text-center transition-colors ${
                active || done ? 'text-primary-700' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 mt-5 h-1 rounded-full bg-gray-200 overflow-hidden">
              <div
                className={`h-full rounded-full bg-brand-gradient transition-all duration-500 ${
                  s.id < current ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const CheckoutPage: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState<StepId>(1);
  const [processing, setProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placedTotal, setPlacedTotal] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalWithTax = total + total * 0.2;

  const shippingValid =
    formData.email &&
    formData.firstName &&
    formData.lastName &&
    formData.address &&
    formData.city &&
    formData.postalCode;

  const paymentValid =
    formData.cardName && formData.cardNumber.replace(/\s/g, '').length >= 12 && formData.expiry && formData.cvc;

  const goTo = (s: StepId) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setPlacedTotal(totalWithTax);
      setOrderNumber('OMZ-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      clearCart();
      setProcessing(false);
      goTo(4);
    }, 1800);
  };

  /* ----- Empty cart (only before confirmation) ----- */
  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="h-20 w-20 mx-auto grid place-items-center rounded-2xl bg-primary-50 text-primary-500 mb-6">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">
          Ajoutez des produits à votre panier pour procéder au paiement.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Continuer mes achats
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Finaliser votre commande
      </h1>
      <p className="text-gray-500 mb-8">Quatre étapes simples et sécurisées.</p>

      <Stepper current={step} />

      {/* ---------- Step 4: Confirmation (full width) ---------- */}
      {step === 4 ? (
        <div className="max-w-xl mx-auto text-center animate-slide-up">
          <div className="card p-10">
            <div className="h-20 w-20 mx-auto grid place-items-center rounded-full bg-success-50 text-success-600 mb-6 animate-fade-in">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Commande confirmée !</h2>
            <p className="text-gray-500 mb-6">
              Merci pour votre achat. Un e-mail de confirmation vous a été envoyé.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">N° de commande</span>
                <span className="font-semibold text-gray-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Montant payé</span>
                <span className="font-bold gradient-text">{formatPrice(placedTotal)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-200">
                <Package size={16} className="text-primary-500" />
                Livraison estimée sous 2 à 4 jours ouvrés
              </div>
            </div>

            <button onClick={() => navigate('/')} className="btn-primary w-full">
              Continuer mes achats
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---------- Left: step content ---------- */}
          <div className="lg:col-span-2">
            <div key={step} className="animate-slide-up">
              {/* Step 1 — Panier */}
              {step === 1 && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-primary-600" />
                    Votre panier ({items.length})
                  </h2>
                  <div className="space-y-4">
                    {items.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-3 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-400 capitalize">{product.category}</p>
                          <p className="text-sm font-bold gradient-text mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-xl">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-2 text-gray-500 hover:text-primary-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-medium min-w-[28px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="p-2 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                          aria-label="Retirer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Link to="/" className="btn-secondary">
                      <ArrowLeft size={18} className="mr-1" /> Continuer mes achats
                    </Link>
                    <button onClick={() => goTo(2)} className="btn-primary">
                      Vers la livraison <ArrowRight size={18} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Livraison */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-primary-600" />
                      Coordonnées
                    </h2>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Adresse e-mail"
                      className="input-field"
                    />
                  </div>

                  <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Truck size={20} className="text-primary-600" />
                      Adresse de livraison
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Prénom" className="input-field" />
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Nom" className="input-field" />
                    </div>
                    <div className="space-y-4 mt-4">
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Adresse" className="input-field" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ville" className="input-field" />
                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Code postal" className="input-field" />
                        <select name="country" value={formData.country} onChange={handleInputChange} className="input-field">
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => goTo(1)} className="btn-secondary">
                      <ArrowLeft size={18} className="mr-1" /> Retour
                    </button>
                    <button
                      onClick={() => goTo(3)}
                      disabled={!shippingValid}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Vers le paiement <ArrowRight size={18} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 — Paiement */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="card p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-primary-600" />
                      Informations de paiement
                    </h2>

                    <div className="flex items-center gap-2 bg-primary-50 text-primary-700 rounded-xl p-3 mb-5 text-sm">
                      <Lock size={16} />
                      Paiement chiffré et sécurisé par Stripe
                    </div>

                    <div className="space-y-4">
                      <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder="Nom sur la carte" className="input-field" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        inputMode="numeric"
                        maxLength={19}
                        className="input-field"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="expiry" value={formData.expiry} onChange={handleInputChange} placeholder="MM / AA" maxLength={7} className="input-field" />
                        <input type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="CVC" maxLength={4} inputMode="numeric" className="input-field" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => goTo(2)} className="btn-secondary">
                      <ArrowLeft size={18} className="mr-1" /> Retour
                    </button>
                    <button
                      onClick={handlePay}
                      disabled={!paymentValid || processing}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {processing ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-b-transparent mr-2" />
                          Traitement…
                        </>
                      ) : (
                        <>
                          <Lock size={18} className="mr-2" /> Payer {formatPrice(totalWithTax)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---------- Right: order summary ---------- */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="absolute -top-2 -right-2 h-5 w-5 grid place-items-center text-[10px] font-bold text-white bg-brand-gradient rounded-full">
                        {quantity}
                      </span>
                    </div>
                    <p className="flex-1 text-sm font-medium text-gray-700 truncate">{product.name}</p>
                    <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-semibold text-success-600">Gratuite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TVA (20%)</span>
                  <span className="font-semibold">{formatPrice(total * 0.2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold gradient-text">{formatPrice(totalWithTax)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-success-500" />
                Paiement 100% sécurisé
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
