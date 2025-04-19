import React, { useState } from 'react';
import BookList from '../../components/BookList/BookList';
import BookForm from '../../components/BookForm/BookForm';
import BookFilter from '../../components/BookFilter/BookFilter';
import Modal from '../../components/Modal/Modal';
import styles from './Home.module.css';

const Home = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h2>Koleksi Buku Saya</h2>
        <button 
          className={styles.addButton}
          onClick={handleAddClick}
          data-testid="add-book-button"
        >
          Tambah Buku Baru
        </button>
      </div>

      <BookFilter />
      <BookList />

      {showAddForm && (
        <Modal onClose={handleFormClose}>
          <BookForm onClose={handleFormClose} />
        </Modal>
      )}
    </div>
  );
};

export default Home;