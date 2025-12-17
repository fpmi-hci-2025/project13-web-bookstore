import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Star, Truck, Shield } from 'lucide-react';
import { Book, Author } from '../types';
import { booksApi, authorsApi } from '../api';
import BookCard from '../components/books/BookCard';
import { PageLoader } from '../components/ui/Spinner';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, authorsData] = await Promise.all([
          booksApi.getAll(1, 8),
          authorsApi.getAll(),
        ]);
        setBooks(booksData.books || []);
        setAuthors(authorsData.slice(0, 6));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              New arrivals every week
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Discover Your Next
              <span className="text-primary-400"> Favorite Book</span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              Explore our vast collection of books across all genres. From bestsellers to hidden gems, 
              find the perfect read for every mood.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/books" className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-3">
                Browse Books
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/authors" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Meet Authors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $30' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Star, title: 'Best Quality', desc: 'Curated collections' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900">Featured Books</h2>
              <p className="mt-2 text-slate-500">Hand-picked selections for you</p>
            </div>
            <Link to="/books" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Authors */}
      {authors.length > 0 && (
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900">Popular Authors</h2>
                <p className="mt-2 text-slate-500">Meet the minds behind the books</p>
              </div>
              <Link to="/authors" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {authors.map((author) => (
                <Link
                  key={author.id}
                  to={`/authors/${author.id}`}
                  className="group text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img
                      src={author.image_url || 'https://via.placeholder.com/100'}
                      alt={author.name}
                      className="w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg group-hover:ring-primary-200 transition-all"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-sm text-slate-500">{author.role}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Ready to Start Reading?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Join thousands of book lovers and get access to exclusive deals and recommendations.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
          >
            Create Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

