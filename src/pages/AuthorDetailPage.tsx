import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { Author } from '../types';
import { authorsApi } from '../api';
import BookCard from '../components/books/BookCard';
import { PageLoader } from '../components/ui/Spinner';

export default function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthor = async () => {
      if (!id) return;
      try {
        const data = await authorsApi.getById(id);
        setAuthor(data);
      } catch (error) {
        console.error('Failed to load author:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthor();
  }, [id]);

  if (isLoading) return <PageLoader />;

  if (!author) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-on-primary mb-2">Author not found</h2>
          <Link to="/authors" className="text-primary hover:text-primary-600">
            ← Back to Authors
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
          to="/authors"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-primary mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Authors
        </Link>

        {/* Author Info */}
        <div className="bg-surface rounded-2xl shadow-sm border border-secondary-100 p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src={author.image_url || '/placeholder-book.svg'}
              alt={author.name}
              className="w-40 h-40 rounded-full object-cover shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-book.svg';
              }}
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold text-on-primary">
                {author.name}
              </h1>
              <p className="mt-1 text-lg text-secondary">{author.role}</p>

              <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-medium text-on-primary">{author.rating.toFixed(1)}</span>
                <span className="text-secondary">rating</span>
              </div>

              <p className="mt-6 text-secondary leading-relaxed max-w-2xl">
                {author.biography}
              </p>
            </div>
          </div>
        </div>

        {/* Author's Books */}
        {author.books && author.books.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-on-primary mb-6">
              Books by {author.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {author.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
