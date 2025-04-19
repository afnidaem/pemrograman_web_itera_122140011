import { useMemo, useContext } from 'react';
import { BookContext } from '../context/BookContext';

// Custom hook untuk menghitung statistik buku
const useBookStats = () => {
  const { books } = useContext(BookContext);

  const stats = useMemo(() => {
    // Inisialisasi objek statistik
    const result = {
      total: books.length,
      byStatus: {
        dimiliki: 0,
        dibaca: 0,
        dibeli: 0
      },
      topAuthors: [],
    };

    // Lewati perhitungan jika tidak ada buku
    if (!books.length) return result;

    // Hitung buku berdasarkan status
    books.forEach(book => {
      if (book.status === 'dimiliki') result.byStatus.dimiliki++;
      else if (book.status === 'dibaca') result.byStatus.dibaca++;
      else if (book.status === 'dibeli') result.byStatus.dibeli++;
    });

    // Hitung penulis terpopuler
    const authorCounts = {};
    books.forEach(book => {
      if (!authorCounts[book.author]) {
        authorCounts[book.author] = 0;
      }
      authorCounts[book.author]++;
    });

    result.topAuthors = Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return result;
  }, [books]);

  return stats;
};

export default useBookStats;