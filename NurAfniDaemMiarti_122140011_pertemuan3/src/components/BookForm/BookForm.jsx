import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BookContext } from '../../context/BookContext';
import styles from './BookForm.module.css';

const BookForm = ({ editBook = null, onClose }) => {
  const { addBook, editBook: updateBook } = useContext(BookContext);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    status: 'dimiliki',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // If editing, populate form with book data
  useEffect(() => {
    if (editBook) {
      setFormData({
        id: editBook.id,
        title: editBook.title,
        author: editBook.author,
        status: editBook.status,
      });
    }
  }, [editBook]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Clear success message when form changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editBook) {
        updateBook(formData);
        setSuccessMessage('Buku berhasil diperbarui!');
      } else {
        addBook(formData);
        setSuccessMessage('Buku baru berhasil ditambahkan!');
        
        // Reset form after adding new book
        setFormData({
          id: '',
          title: '',
          author: '',
          status: 'dimiliki',
        });
      }
      
      // Close modal after successful operation with slight delay
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      setErrors({
        ...errors,
        form: 'Terjadi kesalahan. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.bookForm} onSubmit={handleSubmit}>
      <h2>{editBook ? 'Edit Buku' : 'Tambah Buku Baru'}</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      {errors.form && (
        <div className={styles.errorForm}>
          {errors.form}
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label htmlFor="title">Judul:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? styles.inputError : ''}
          data-testid="book-title-input"
          disabled={isSubmitting}
        />
        {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="author">Penulis:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={errors.author ? styles.inputError : ''}
          data-testid="book-author-input"
          disabled={isSubmitting}
        />
        {errors.author && <span className={styles.errorMessage}>{errors.author}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          data-testid="book-status-select"
          disabled={isSubmitting}
        >
          <option value="dimiliki">Dimiliki</option>
          <option value="dibaca">Sedang Dibaca</option>
          <option value="dibeli">Ingin Dibeli</option>
        </select>
      </div>

      <div className={styles.formActions}>
        <button 
          type="submit" 
          className={styles.submitButton}
          data-testid="book-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Memproses...' : (editBook ? 'Perbarui Buku' : 'Tambah Buku')}
        </button>
        {!isSubmitting && onClose && (
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

BookForm.propTypes = {
  editBook: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func,
};

export default BookForm;