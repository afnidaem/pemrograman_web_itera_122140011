import React, { useContext, useState } from 'react';
import { BookContext } from '../../context/BookContext';
import BookItem from '../BookItem/BookItem';
import BookForm from '../BookForm/BookForm';
import Modal from '../Modal/Modal';
import styles from './BookList.module.css';

const BookList = () => {
  const { filteredBooks } = useContext(BookContext);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  if (filteredBooks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Tidak ada buku ditemukan. Tambahkan buku baru atau ubah filter Anda.</p>
      </div>
    );
  }

  return (
    <div className={styles.bookList} data-testid="book-list">
      {filteredBooks.map((book) => (
        <BookItem 
          key={book.id} 
          book={book} 
          onEdit={() => handleEdit(book)} 
        />
      ))}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <BookForm editBook={editingBook} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default BookList;