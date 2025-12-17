import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Book } from '../types';
import { booksApi } from '../api';
import BookCard from '../components/books/BookCard';
import { PageLoader } from '../components/ui/Spinner';
import clsx from 'clsx';

const GENRES = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Non-Fiction', 'Biography', 'History'];
const PRICE_RANGES = [
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: '$20 - $30', min: 20, max: 30 },
  { label: 'Over $30', min: 30, max: 1000 },
];

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<typeof PRICE_RANGES[0] | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'price_asc' | 'price_desc' | 'rating'>('title');

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const query = searchParams.get('search');
        const data = query
          ? await booksApi.search(query)
          : await booksApi.getAll(1, 100);
        setBooks(data.books || []);
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [searchParams]);

  useEffect(() => {
    let result = [...books];

    // Filter by genre
    if (selectedGenres.length > 0) {
      result = result.filter((book) =>
        selectedGenres.some((genre) =>
          book.genre?.toLowerCase().includes(genre.toLowerCase())
        )
      );
    }

    // Filter by price
    if (selectedPriceRange) {
      result = result.filter(
        (book) =>
          book.price >= selectedPriceRange.min && book.price <= selectedPriceRange.max
      );
    }

    // Sort
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredBooks(result);
  }, [books, selectedGenres, selectedPriceRange, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedPriceRange(null);
    setSortBy('title');
  };

  const hasActiveFilters = selectedGenres.length > 0 || selectedPriceRange !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-display font-bold text-on-primary">Books</h1>
          <p className="mt-2 text-secondary">
            {filteredBooks.length > 0
              ? `${filteredBooks.length} books${hasActiveFilters ? ' (filtered)' : ''}`
              : 'Explore our collection'}
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-6 flex gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'btn-secondary inline-flex items-center gap-2',
                showFilters && 'border-primary text-primary'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {selectedGenres.length + (selectedPriceRange ? 1 : 0)}
                </span>
              )}
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-background rounded-xl border border-secondary-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-on-primary">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Genre */}
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-3">Genre</h4>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                          selectedGenres.includes(genre)
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-secondary-200 text-secondary hover:border-primary hover:text-primary'
                        )}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-3">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setSelectedPriceRange(
                            selectedPriceRange?.label === range.label ? null : range
                          )
                        }
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                          selectedPriceRange?.label === range.label
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-secondary-200 text-secondary hover:border-primary hover:text-primary'
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="text-sm font-medium text-secondary mb-3">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="input-field py-2"
                  >
                    <option value="title">Title (A-Z)</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {genre}
                  <button onClick={() => toggleGenre(genre)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedPriceRange && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {selectedPriceRange.label}
                  <button onClick={() => setSelectedPriceRange(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <PageLoader />
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-on-primary">No books found</h3>
            <p className="mt-2 text-secondary">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 text-primary hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
