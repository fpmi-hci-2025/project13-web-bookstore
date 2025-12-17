import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { Book } from '../types';
import { booksApi, favoritesApi } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/ui/Spinner';
import ReviewSection from '../components/reviews/ReviewSection';
import clsx from 'clsx';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [displayRating, setDisplayRating] = useState<number | null>(null);
  const [displayReviewCount, setDisplayReviewCount] = useState<number | null>(null);

  const handleRatingChange = (newRating: number, reviewCount: number) => {
    setDisplayRating(newRating);
    setDisplayReviewCount(reviewCount);
  };

  // Use dynamic rating if available, otherwise use book's rating
  const currentRating = displayRating ?? book?.rating ?? 0;
  const currentReviewCount = displayReviewCount ?? book?.review_count ?? 0;

  useEffect(() => {
    const loadBook = async () => {
      if (!id) return;
      try {
        const data = await booksApi.getById(id);
        setBook(data);
      } catch (error) {
        console.error('Failed to load book:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleAddToCart = async () => {
    if (!book || !isAuthenticated) return;
    setIsAdding(true);
    try {
      await addToCart(book.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!book || !isAuthenticated || isFavLoading) return;
    setIsFavLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.remove(book.id);
        setIsFavorite(false);
      } else {
        await favoritesApi.add(book.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsFavLoading(false);
    }
  };

  if (isLoading) return <PageLoader />;

  if (!book) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-on-primary mb-2">Book not found</h2>
          <Link to="/books" className="text-primary hover:text-primary-600">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-[3/4] max-w-md mx-auto lg:mx-0">
            <img
              src={book.image_url || '/placeholder-book.svg'}
              alt={book.title}
              className="w-full h-full object-cover rounded-2xl shadow-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-book.svg';
              }}
            />
          </div>

          {/* Details */}
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {book.genre || 'Fiction'}
            </span>

            <h1 className="mt-2 text-3xl md:text-4xl font-display font-bold text-on-primary">
              {book.title}
            </h1>

            <p className="mt-2 text-lg text-secondary">{book.publisher}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 transition-colors ${
                      star <= Math.round(currentRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-secondary-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-secondary">
                {currentRating.toFixed(1)} ({currentReviewCount} review{currentReviewCount !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <span className="text-4xl font-bold text-on-primary">
                ${book.price.toFixed(2)}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {book.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  ✓ In Stock ({book.stock} available)
                </span>
              ) : (
                <span className="text-rose-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              {isAuthenticated && book.stock > 0 && (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="btn-primary flex-1 py-4 inline-flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={isFavLoading}
                  className={clsx(
                    'btn-secondary p-4 transition-all',
                    isFavorite && 'bg-primary text-white border-primary'
                  )}
                >
                  <Heart className={clsx('w-6 h-6', isFavorite && 'fill-current')} />
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <p className="mt-4 text-secondary">
                <Link to="/login" className="text-primary hover:text-primary-600">
                  Sign in
                </Link>{' '}
                to add this book to your cart
              </p>
            )}

            {/* Description */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-on-primary mb-4">Description</h2>
              <p className="text-secondary leading-relaxed">{book.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection bookId={book.id} onRatingChange={handleRatingChange} />
      </div>
    </div>
  );
}
