import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/Spinner';

const statusConfig = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  processing: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Cancelled' },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersApi.cancel(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
      );
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-primary mb-2">Sign in to view orders</h2>
          <p className="text-secondary mb-6">You need to be logged in to see your orders</p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-on-primary mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-on-primary mb-2">No orders yet</h2>
            <p className="text-secondary mb-6">Start shopping to see your orders here</p>
            <Link to="/books" className="btn-primary">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-secondary">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-secondary">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  <div className="border-t border-secondary-100 pt-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-2">
                        <img
                          src={item.book?.image_url || '/placeholder-book.svg'}
                          alt={item.book?.title || 'Book'}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-book.svg';
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-on-primary">{item.book?.title || 'Book'}</p>
                          <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price ?? 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-secondary-100 pt-4 mt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold">
                      Total: <span className="text-primary">${(order.total ?? 0).toFixed(2)}</span>
                    </p>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-rose-500 hover:text-rose-600 font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

