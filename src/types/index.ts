export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  genre: string;
  publisher: string;
  stock: number;
  rating: number;
  review_count: number;
  author_id: string;
  author?: Author;
}

export interface Author {
  id: string;
  name: string;
  biography: string;
  image_url: string;
  role: string;
  rating: number;
  books?: Book[];
}

export interface CartItem {
  id: string;
  book_id: string;
  quantity: number;
  book?: Book;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  delivery_address?: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  book_id: string;
  quantity: number;
  price: number;
  book?: Book;
}

export interface Favorite {
  id: string;
  book_id: string;
  book?: Book;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  page_size: number;
}

