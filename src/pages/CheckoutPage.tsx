import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-on-primary mb-2">Sign in to checkout</h2>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-on-primary mb-2">Your cart is empty</h2>
          <Link to="/books" className="btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-on-primary mb-2">Order Placed!</h2>
          <p className="text-secondary mb-6">Thank you for your purchase</p>
          <div className="flex gap-4 justify-center">
            <Link to="/orders" className="btn-primary">
              View Orders
            </Link>
            <Link to="/books" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await ordersApi.create(address);
      await clearCart();
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-on-primary mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-on-primary mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-on-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input type="radio" name="payment" defaultChecked className="text-primary" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary transition-colors opacity-50">
                  <input type="radio" name="payment" disabled />
                  <span>Credit Card (Coming soon)</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-600">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order • $${cart.total.toFixed(2)}`}
            </button>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-on-primary mb-4">Order Summary</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.book?.image_url || '/placeholder-book.svg'}
                      alt={item.book?.title || 'Book'}
                      className="w-16 h-20 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-book.svg';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-on-primary line-clamp-2">{item.book?.title}</p>
                      <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                      <p className="font-medium text-primary">
                        ${((item.book?.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-100 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-secondary-100">
                  <span>Total</span>
                  <span className="text-primary">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

