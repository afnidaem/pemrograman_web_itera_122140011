import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { BookContext } from '../../context/BookContext';
import styles from './BookItem.module.css';

const statusLabels = {
  dimiliki: 'Dimiliki',
  dibaca: 'Sedang Dibaca',
  dibeli: 'Ingin Dibeli'
};

const statusColors = {
  dimiliki: styles.statusOwned,
  dibaca: styles.statusReading,
  dibeli: styles.statusToBuy
};

const BookItem = ({ book, onEdit }) => {
  const { deleteBook } = useContext(BookContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    
    try {
      deleteBook(book.id);
      // Karena item akan dihapus dari DOM, kita tidak perlu reset state di sini
    } catch (error) {
      console.error('Gagal menghapus buku:', error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className={`${styles.bookItem} ${isDeleting ? styles.deleting : ''}`} data-testid="book-item">
      <div className={styles.bookContent}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookAuthor}>oleh {book.author}</p>
        <div className={`${styles.bookStatus} ${statusColors[book.status]}`}>
          {statusLabels[book.status]}
        </div>
      </div>
      
      {showConfirm ? (
        <div className={styles.confirmDelete}>
          <p>Apakah Anda yakin ingin menghapus buku ini?</p>
          <div className={styles.confirmButtons}>
            <button 
              className={styles.confirmButton} 
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </button>
            <button 
              className={styles.cancelButton} 
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.bookActions}>
          <button 
            className={styles.editButton} 
            onClick={onEdit}
            data-testid="edit-book-button"
          >
            Edit
          </button>
          <button 
            className={styles.deleteButton} 
            onClick={handleDeleteClick}
            data-testid="delete-book-button"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default BookItem;