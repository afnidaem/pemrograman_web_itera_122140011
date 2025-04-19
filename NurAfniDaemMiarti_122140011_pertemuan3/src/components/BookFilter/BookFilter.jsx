import React, { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import styles from './BookFilter.module.css';

const BookFilter = () => {
  const { filter, setFilter, searchTerm, setSearchTerm } = useContext(BookContext);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Cari buku..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
          data-testid="search-input"
        />
      </div>
      
      <div className={styles.filterBox}>
        <label htmlFor="status-filter" className={styles.filterLabel}>Filter:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={handleFilterChange}
          className={styles.filterSelect}
          data-testid="status-filter"
        >
          <option value="semua">Semua Buku</option>
          <option value="dimiliki">Dimiliki</option>
          <option value="dibaca">Sedang Dibaca</option>
          <option value="dibeli">Ingin Dibeli</option>
        </select>
      </div>
    </div>
  );
};

export default BookFilter;