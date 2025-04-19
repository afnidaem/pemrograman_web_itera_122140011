import React from 'react';
import { render, screen } from '@testing-library/react';
import BookList from './BookList';
import { BookContext } from '../../context/BookContext';

// Mock komponen yang digunakan dalam BookList
jest.mock('../BookItem/BookItem', () => () => <div data-testid="mock-book-item" />);
jest.mock('../Modal/Modal', () => ({ children, onClose }) => (
  <div data-testid="mock-modal">{children}</div>
));
jest.mock('../BookForm/BookForm', () => () => <div data-testid="mock-book-form" />);

// Helper function untuk render dengan context
const renderWithContext = (ui, contextValue) => {
  return render(
    <BookContext.Provider value={contextValue}>
      {ui}
    </BookContext.Provider>
  );
};

describe('BookList Component', () => {
  test('renders empty state when no books', () => {
    renderWithContext(<BookList />, { 
      filteredBooks: [] 
    });
    
    expect(screen.getByText(/Tidak ada buku ditemukan/i)).toBeInTheDocument();
  });

  test('renders book items when books are available', () => {
    const mockBooks = [
      { id: '1', title: 'Buku 1', author: 'Penulis 1', status: 'dimiliki' },
      { id: '2', title: 'Buku 2', author: 'Penulis 2', status: 'dibaca' }
    ];
    
    renderWithContext(<BookList />, { 
      filteredBooks: mockBooks,
      deleteBook: jest.fn()
    });
    
    const bookItems = screen.getAllByTestId('mock-book-item');
    expect(bookItems).toHaveLength(2);
  });
});