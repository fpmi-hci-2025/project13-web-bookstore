import apiClient, { setToken, removeToken } from './client';
import type { 
  User, Book, Author, Cart, Order, Favorite, 
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

  addItem: async (bookId: string, quantity = 1): Promise<Cart> => {
    const { data } = await apiClient.post('/cart', { book_id: bookId, quantity });
    return data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await apiClient.put(`/cart/${itemId}`, { quantity });
    return data;
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

