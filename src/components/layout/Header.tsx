import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, BookOpen, Heart, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-surface border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-on-primary">
              BookStore
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-background focus:bg-surface"
              />
            </div>
          </form>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <Link
              to="/books"
              className="px-4 py-2 text-secondary hover:text-on-primary font-medium transition-colors"
            >
              Books
            </Link>
            <Link
              to="/authors"
              className="px-4 py-2 text-secondary hover:text-on-primary font-medium transition-colors"
            >
              Authors
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/favorites"
                  className="p-2 text-secondary hover:text-primary transition-colors relative"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                <Link
                  to="/cart"
                  className="p-2 text-secondary hover:text-primary transition-colors relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-background transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-secondary-100 py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="font-medium text-on-primary">{user?.username}</p>
                        <p className="text-sm text-secondary">{user?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-secondary hover:bg-background"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 px-4 py-2 text-secondary hover:bg-background"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-4 h-4" />
                        Favorites
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-rose-500 hover:bg-rose-50 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
