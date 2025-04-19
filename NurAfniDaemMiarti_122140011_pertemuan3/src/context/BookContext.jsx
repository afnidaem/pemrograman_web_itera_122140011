import React, { createContext, useReducer, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create context
export const BookContext = createContext();

// Define reducer actions
const ACTIONS = {
  ADD_BOOK: 'tambah-buku',
  EDIT_BOOK: 'edit-buku',
  DELETE_BOOK: 'hapus-buku',
  SET_FILTER: 'atur-filter',
  SET_SEARCH: 'atur-pencarian',
};

// Initial state
const initialState = {
  books: [],
  filter: 'semua',
  searchTerm: '',
};

// Reducer function
const bookReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_BOOK:
      return {
        ...state,
        books: [...state.books, { ...action.payload, id: Date.now().toString() }],
      };
    case ACTIONS.EDIT_BOOK:
      return {
        ...state,
        books: state.books.map((book) => 
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case ACTIONS.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
      };
    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const BookProvider = ({ children }) => {
  const [savedBooks, setSavedBooks] = useLocalStorage('bukuSaya', []);
  
  const [state, dispatch] = useReducer(bookReducer, {
    ...initialState,
    books: savedBooks,
  });

  // Save books to localStorage whenever they change
  useEffect(() => {
    setSavedBooks(state.books);
    console.log('Data buku disimpan ke localStorage:', state.books);
  }, [state.books, setSavedBooks]);

  // Actions
  const addBook = (book) => {
    dispatch({ type: ACTIONS.ADD_BOOK, payload: book });
  };

  const editBook = (book) => {
    dispatch({ type: ACTIONS.EDIT_BOOK, payload: book });
  };

  const deleteBook = (id) => {
    dispatch({ type: ACTIONS.DELETE_BOOK, payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
  };

  const setSearchTerm = (term) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: term });
  };

  // Calculate filtered and searched books
  const getFilteredBooks = () => {
    return state.books
      .filter((book) => {
        if (state.filter === 'semua') return true;
        return book.status === state.filter;
      })
      .filter((book) => {
        if (!state.searchTerm) return true;
        return (
          book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      });
  };

  return (
    <BookContext.Provider
      value={{
        books: state.books,
        filter: state.filter,
        searchTerm: state.searchTerm,
        filteredBooks: getFilteredBooks(),
        addBook,
        editBook,
        deleteBook,
        setFilter,
        setSearchTerm,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};