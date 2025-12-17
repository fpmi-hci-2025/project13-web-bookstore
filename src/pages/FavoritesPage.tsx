import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Favorite } from '../types';
import { favoritesApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/Spinner';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const data = await favoritesApi.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await favoritesApi.remove(bookId);
      setFavorites((prev) => prev.filter((f) => f.book_id !== bookId));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-on-primary mb-2">Sign in to view favorites</h2>
          <p className="text-secondary mb-6">You need to be logged in to see your favorites</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-on-primary mb-8">My Favorites</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-on-primary mb-2">No favorites yet</h2>
            <p className="text-secondary mb-6">Start adding books to your favorites</p>
            <Link to="/books" className="btn-primary">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="card p-4 flex gap-4">
                <Link to={`/books/${fav.book_id}`}>
                  <img
                    src={fav.book?.image_url || '/placeholder-book.svg'}
                    alt={fav.book?.title || 'Book'}
                    className="w-20 h-28 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-book.svg';
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/books/${fav.book_id}`}>
                    <h3 className="font-semibold text-on-primary hover:text-primary transition-colors">
                      {fav.book?.title || 'Unknown Book'}
                    </h3>
                  </Link>
                  <p className="text-sm text-secondary">{fav.book?.publisher}</p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ${(fav.book?.price ?? 0).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(fav.book_id)}
                  className="self-start p-2 text-secondary hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

