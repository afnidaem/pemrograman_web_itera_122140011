import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../../components/BookForm/BookForm';
import { BookContext } from '../../context/BookContext';

// Mock the book context
const mockAddBook = jest.fn();
const mockEditBook = jest.fn();

const renderWithContext = (ui, contextValue) => {
  return render(
    <BookContext.Provider value={contextValue}>
      {ui}
    </BookContext.Provider>
  );
};

describe('Komponen BookForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockAddBook.mockClear();
    mockEditBook.mockClear();
  });

  test('merender form tambah dengan benar', () => {
    renderWithContext(<BookForm />, { addBook: mockAddBook, editBook: mockEditBook });
    
    expect(screen.getByText('Tambah Buku Baru')).toBeInTheDocument();
    expect(screen.getByTestId('book-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('book-author-input')).toBeInTheDocument();
    expect(screen.getByTestId('book-status-select')).toBeInTheDocument();
    expect(screen.getByTestId('book-submit-button')).toHaveTextContent('Tambah Buku');
  });

  test('merender form edit dengan benar', () => {
    const bookToEdit = {
      id: '123',
      title: 'Buku Test',
      author: 'Penulis Test',
      status: 'dibaca'
    };
    
    renderWithContext(<BookForm editBook={bookToEdit} />, { addBook: mockAddBook, editBook: mockEditBook });
    
    expect(screen.getByText('Edit Buku')).toBeInTheDocument();
    expect(screen.getByTestId('book-title-input')).toHaveValue('Buku Test');
    expect(screen.getByTestId('book-author-input')).toHaveValue('Penulis Test');
    expect(screen.getByTestId('book-status-select')).toHaveValue('dibaca');
    expect(screen.getByTestId('book-submit-button')).toHaveTextContent('Perbarui Buku');
  });

  test('menampilkan error validasi untuk kolom kosong', () => {
    renderWithContext(<BookForm />, { addBook: mockAddBook, editBook: mockEditBook });
    
    fireEvent.click(screen.getByTestId('book-submit-button'));
    
    expect(screen.getByText('Judul buku wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi')).toBeInTheDocument();
    expect(mockAddBook).not.toHaveBeenCalled();
  });

  test('memanggil addBook ketika form disubmit dengan data valid', () => {
    renderWithContext(<BookForm />, { addBook: mockAddBook, editBook: mockEditBook });
    
    fireEvent.change(screen.getByTestId('book-title-input'), { target: { value: 'Buku Baru' } });
    fireEvent.change(screen.getByTestId('book-author-input'), { target: { value: 'Penulis Baru' } });
    fireEvent.change(screen.getByTestId('book-status-select'), { target: { value: 'dibeli' } });
    
    fireEvent.click(screen.getByTestId('book-submit-button'));
    
    expect(mockAddBook).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Buku Baru',
      author: 'Penulis Baru',
      status: 'dibeli'
    }));
  });

  test('memanggil onClose ketika tombol batal diklik', () => {
    const mockOnClose = jest.fn();
    renderWithContext(<BookForm onClose={mockOnClose} />, { addBook: mockAddBook, editBook: mockEditBook });
    
    fireEvent.click(screen.getByText('Batal'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});