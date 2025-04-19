import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookItem from './BookItem'; // Ganti dengan path yang sesuai
import { BookContext } from '../../context/BookContext'; // Ganti dengan path yang sesuai

// Mocking BookContext
const mockDeleteBook = jest.fn();

const Wrapper = ({ children }) => (
  <BookContext.Provider value={{ deleteBook: mockDeleteBook }}>
    {children}
  </BookContext.Provider>
);

// Data buku untuk pengujian
const mockBook = {
  id: '1',
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  status: 'dimiliki',
};

describe('BookItem Component', () => {
  test('renders book information correctly', () => {
    render(
      <Wrapper>
        <BookItem book={mockBook} onEdit={() => {}} />
      </Wrapper>
    );

    // Memeriksa apakah judul buku, penulis, dan status ditampilkan
    expect(screen.getByText(/The Great Gatsby/i)).toBeInTheDocument();
    expect(screen.getByText(/oleh F. Scott Fitzgerald/i)).toBeInTheDocument();
    expect(screen.getByText('Dimiliki')).toBeInTheDocument();
  });

  test('renders edit and delete buttons', () => {
    render(
      <Wrapper>
        <BookItem book={mockBook} onEdit={() => {}} />
      </Wrapper>
    );

    // Memeriksa apakah tombol edit dan hapus ada
    expect(screen.getByTestId('edit-book-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-book-button')).toBeInTheDocument();
  });

  test('opens confirmation when delete button is clicked', () => {
    render(
      <Wrapper>
        <BookItem book={mockBook} onEdit={() => {}} />
      </Wrapper>
    );

    // Klik tombol hapus
    fireEvent.click(screen.getByTestId('delete-book-button'));

    // Memeriksa jika konfirmasi penghapusan muncul
    expect(screen.getByText(/Apakah Anda yakin ingin menghapus buku ini?/i)).toBeInTheDocument();
    expect(screen.getByText('Ya, Hapus')).toBeInTheDocument();
    expect(screen.getByText('Batal')).toBeInTheDocument();
  });

  test('calls deleteBook when confirm delete is clicked', async () => {
    render(
      <Wrapper>
        <BookItem book={mockBook} onEdit={() => {}} />
      </Wrapper>
    );

    // Klik tombol hapus
    fireEvent.click(screen.getByTestId('delete-book-button'));

    // Klik tombol konfirmasi hapus
    fireEvent.click(screen.getByText('Ya, Hapus'));

    // Menunggu fungsi penghapusan dipanggil
    await waitFor(() => expect(mockDeleteBook).toHaveBeenCalledWith(mockBook.id));
  });

  test('does not call deleteBook if cancel is clicked', () => {
    render(
      <Wrapper>
        <BookItem book={mockBook} onEdit={() => {}} />
      </Wrapper>
    );

    // Klik tombol hapus
    fireEvent.click(screen.getByTestId('delete-book-button'));

    // Klik tombol batal
    fireEvent.click(screen.getByText('Batal'));

    // Memeriksa bahwa deleteBook tidak dipanggil
    expect(mockDeleteBook).not.toHaveBeenCalled();
  });
});
