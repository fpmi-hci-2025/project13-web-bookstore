import { useState, useEffect } from 'react';
import { Star, User, Trash2, Edit2, Send } from 'lucide-react';
import { Review } from '../../types';
import { reviewsApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

interface ReviewSectionProps {
  bookId: string;
  onRatingChange?: (newRating: number, reviewCount: number) => void;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
  size = 'md',
}: {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hovered, setHovered] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={clsx(
            'transition-colors',
            interactive && 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={clsx(
              sizeClasses[size],
              (hovered || rating) >= star
                ? 'text-amber-400 fill-amber-400'
                : 'text-secondary-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ bookId, onRatingChange }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [bookId]);

  // Notify parent when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      onRatingChange?.(avg, reviews.length);
    }
  }, [reviews, onRatingChange]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewsApi.getByBook(bookId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const userReview = reviews.find((r) => r.user_id === user?.id);
  const canReview = isAuthenticated && !userReview;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (editingReview) {
        const updated = await reviewsApi.update(editingReview.id, rating, comment);
        setReviews((prev) =>
          prev.map((r) => (r.id === editingReview.id ? updated : r))
        );
        setEditingReview(null);
      } else {
        const newReview = await reviewsApi.create(bookId, rating, comment);
        setReviews((prev) => [newReview, ...prev]);
        setShowForm(false);
      }
      setRating(5);
      setComment('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewsApi.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setRating(5);
    setComment('');
    setError('');
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-on-primary">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={Math.round(averageRating)} size="sm" />
              <span className="text-secondary">
                {averageRating.toFixed(1)} ({reviews.length} review
                {reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {canReview && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-on-primary mb-4">
            {editingReview ? 'Edit Review' : 'Write a Review'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-primary mb-2">
                Your Rating
              </label>
              <StarRating
                rating={rating}
                onRate={setRating}
                interactive
                size="lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-primary mb-2">
                Your Review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            {error && (
              <p className="text-rose-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting
                  ? 'Submitting...'
                  : editingReview
                  ? 'Update Review'
                  : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8 text-secondary">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl border border-secondary-100">
          <p className="text-secondary">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user?.username?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-on-primary">
                      {review.user?.username || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {user?.id === review.user_id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-secondary hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-secondary hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {review.comment && (
                <p className="mt-3 text-secondary leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

