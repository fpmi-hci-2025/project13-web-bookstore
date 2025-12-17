import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Author } from '../types';
import { authorsApi } from '../api';
import { PageLoader } from '../components/ui/Spinner';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        const data = await authorsApi.getAll();
        setAuthors(data);
      } catch (error) {
        console.error('Failed to load authors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthors();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-surface border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-on-primary">Authors</h1>
          <p className="mt-2 text-secondary">
            Meet the brilliant minds behind your favorite books
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authors.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-on-primary">No authors found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link
                key={author.id}
                to={`/authors/${author.id}`}
                className="card p-6 flex gap-4 group"
              >
                <img
                  src={author.image_url || '/placeholder-book.svg'}
                  alt={author.name}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-book.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-primary group-hover:text-primary transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-sm text-secondary">{author.role}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{author.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-2 text-sm text-secondary line-clamp-2">
                    {author.biography}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
