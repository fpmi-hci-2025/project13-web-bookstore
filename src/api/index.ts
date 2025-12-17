import apiClient, { setToken, removeToken } from './client';
import type { 
  User, Book, Author, Cart, Order, Favorite, Review,
  AuthResponse, BooksResponse 
} from '../types';

// Auth
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    setToken(data.token);
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', { username, email, password });
    setToken(data.token);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get('/me');
    return data;
  },

  logout: () => {
    removeToken();
  },
};

// Books
export const booksApi = {
  getAll: async (page = 1, pageSize = 12): Promise<BooksResponse> => {
    const { data } = await apiClient.get('/books', {
      params: { page, page_size: pageSize },
    });
    return data;
  },

  getById: async (id: string): Promise<Book> => {
    const { data } = await apiClient.get(`/books/${id}`);
    return data;
  },

  search: async (query: string, page = 1, pageSize = 12): Promise<BooksResponse> => {
    const { data } = await apiClient.get('/books/search', {
      params: { q: query, page, page_size: pageSize },
    });
    return data;
  },
};

// Authors
export const authorsApi = {
  getAll: async (): Promise<Author[]> => {
    const { data } = await apiClient.get('/authors');
    return data;
  },

  getById: async (id: string): Promise<Author> => {
    const { data } = await apiClient.get(`/authors/${id}`);
    return data;
  },
};

// Cart
export const cartApi = {
  get: async (): Promise<Cart> => {
    const { data } = await apiClient.get('/cart');
    return data;
  },

  addItem: async (bookId: string, quantity = 1): Promise<void> => {
    await apiClient.post('/cart', { book_id: bookId, quantity });
  },

  updateItem: async (itemId: string, quantity: number): Promise<void> => {
    await apiClient.put(`/cart/${itemId}`, { quantity });
  },

  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/${itemId}`);
  },

  clear: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};

// Orders
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const { data } = await apiClient.get('/orders');
    if (!data) return [];
    return Array.isArray(data) ? data : data.orders || [];
  },

  create: async (deliveryAddress: string): Promise<Order> => {
    const { data } = await apiClient.post('/orders', { delivery_address: deliveryAddress });
    return data;
  },

  cancel: async (orderId: string): Promise<void> => {
    await apiClient.post(`/orders/${orderId}/cancel`);
  },
};

// Favorites
export const favoritesApi = {
  getAll: async (): Promise<Favorite[]> => {
    const { data } = await apiClient.get('/favorites');
    if (!data) return [];
    return Array.isArray(data) ? data : data.favorites || [];
  },

  add: async (bookId: string): Promise<Favorite> => {
    const { data } = await apiClient.post('/favorites', { book_id: bookId });
    return data;
  },

  remove: async (bookId: string): Promise<void> => {
    await apiClient.delete(`/favorites/${bookId}`);
  },
};

// Reviews
export const reviewsApi = {
  getByBook: async (bookId: string, page = 1, pageSize = 20): Promise<Review[]> => {
    const { data } = await apiClient.get(`/books/${bookId}/reviews`, {
      params: { page, page_size: pageSize },
    });
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  },

  create: async (bookId: string, rating: number, comment: string): Promise<Review> => {
    const { data } = await apiClient.post('/reviews', { book_id: bookId, rating, comment });
    return data;
  },

  update: async (reviewId: string, rating: number, comment: string): Promise<Review> => {
    const { data } = await apiClient.put(`/reviews/${reviewId}`, { rating, comment });
    return data;
  },

  delete: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/reviews/${reviewId}`);
  },
};

