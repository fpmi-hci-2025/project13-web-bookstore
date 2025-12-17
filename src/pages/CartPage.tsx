import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/Spinner';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-primary mb-2">Sign in to view your cart</h2>
          <p className="text-secondary mb-6">You need to be logged in to access your cart</p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-primary mb-2">Your cart is empty</h2>
          <p className="text-secondary mb-6">Start shopping to add items to your cart</p>
          <Link to="/books" className="btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-on-primary">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-rose-600 hover:text-rose-700 font-medium text-sm inline-flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <img
                  src={item.book?.image_url || '/placeholder-book.svg'}
                  alt={item.book?.title || 'Book'}
                  className="w-24 h-32 object-cover rounded-lg bg-secondary-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-book.svg';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-on-primary">{item.book?.title}</h3>
                  <p className="text-sm text-secondary">{item.book?.publisher}</p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ${(item.book?.price ?? 0).toFixed(2)}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-lg bg-secondary-100 hover:bg-secondary-200 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-secondary-100 hover:bg-secondary-200 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-on-primary mb-4">Order Summary</h2>

              <div className="space-y-3 border-b border-secondary-100 pb-4 mb-4">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Total</span>
                <span className="text-primary">${cart.total.toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
