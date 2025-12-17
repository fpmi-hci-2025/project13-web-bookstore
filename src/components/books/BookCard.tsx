import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import clsx from 'clsx';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) return;
    
    setIsAdding(true);
    try {
      await addToCart(book.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/books/${book.id}`} className="card group">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={book.image_url || '/placeholder-book.jpg'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
        
        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={clsx(
            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all',
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:bg-rose-500 hover:text-white'
          )}
        >
          <Heart className={clsx('w-4 h-4', isFavorite && 'fill-current')} />
        </button>

        {/* Stock badge */}
        {book.stock < 5 && book.stock > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-lg">
            Only {book.stock} left
          </span>
        )}
        {book.stock === 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Genre */}
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
          {book.genre || 'Fiction'}
        </span>

        {/* Title */}
        <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {book.title}
        </h3>

        {/* Publisher */}
        <p className="mt-1 text-sm text-slate-500">{book.publisher}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-slate-900">{book.rating.toFixed(1)}</span>
          <span className="text-sm text-slate-400">({book.review_count})</span>
        </div>

        {/* Price & Add to cart */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-slate-900">
            ${book.price.toFixed(2)}
          </span>

          {isAuthenticated && book.stock > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                isAdding
                  ? 'bg-slate-100 text-slate-400'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

