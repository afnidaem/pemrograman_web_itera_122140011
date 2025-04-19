import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookFilter from '../../components/BookFilter/BookFilter';
import { BookContext } from '../../context/BookContext';

// Mock fungsi konteks
const mockSetFilter = jest.fn();
const mockSetSearchTerm = jest.fn();

const renderWithContext = (ui, contextValue) => {
  return render(
    <BookContext.Provider value={contextValue}>
      {ui}
    </BookContext.Provider>
  );
};

describe('Komponen BookFilter', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockSetFilter.mockClear();
    mockSetSearchTerm.mockClear();
  });

  test('merender dengan nilai awal', () => {
    renderWithContext(
      <BookFilter />, 
      { 
        filter: 'semua', 
        searchTerm: '', 
        setFilter: mockSetFilter, 
        setSearchTerm: mockSetSearchTerm 
      }
    );
    
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    expect(screen.getByTestId('status-filter').value).toBe('semua');
  });

  test('memanggil setFilter ketika filter berubah', () => {
    renderWithContext(
      <BookFilter />, 
      { 
        filter: 'semua', 
        searchTerm: '', 
        setFilter: mockSetFilter, 
        setSearchTerm: mockSetSearchTerm 
      }
    );
    
    fireEvent.change(screen.getByTestId('status-filter'), { target: { value: 'dibaca' } });
    
    expect(mockSetFilter).toHaveBeenCalledWith('dibaca');
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
  });

  test('memanggil setSearchTerm ketika input pencarian berubah', () => {
    renderWithContext(
      <BookFilter />, 
      { 
        filter: 'semua', 
        searchTerm: '', 
        setFilter: mockSetFilter, 
        setSearchTerm: mockSetSearchTerm 
      }
    );
    
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'harry potter' } });
    
    expect(mockSetSearchTerm).toHaveBeenCalledWith('harry potter');
    expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
  });

  test('input pencarian memiliki placeholder yang benar', () => {
    renderWithContext(
      <BookFilter />, 
      { 
        filter: 'semua', 
        searchTerm: '', 
        setFilter: mockSetFilter, 
        setSearchTerm: mockSetSearchTerm 
      }
    );
    
    expect(screen.getByPlaceholderText('Cari buku...')).toBeInTheDocument();
  });
});