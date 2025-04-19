import { useState, useEffect } from 'react';

// Custom hook untuk manajemen localStorage
const useLocalStorage = (key, initialValue) => {
  // Dapatkan dari localStorage lalu
  // parse JSON atau kembalikan initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Cek apakah localStorage tersedia (untuk menghindari error di lingkungan SSR)
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      // Validasi JSON yang diterima dari localStorage
      if (item) {
        try {
          return JSON.parse(item);
        } catch (parseError) {
          console.error(`Error parsing localStorage item "${key}":`, parseError);
          window.localStorage.removeItem(key); // Hapus data yang rusak
          return initialValue;
        }
      }
      return initialValue;
    } catch (error) {
      console.error(`Error membaca localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Mengembalikan fungsi setter yang dimodifikasi
  // untuk menyimpan nilai baru ke localStorage
  const setValue = (value) => {
    try {
      // Nilai dapat berupa fungsi sehingga API sama dengan useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Simpan ke state
      setStoredValue(valueToStore);
      
      // Simpan ke localStorage dengan penanganan error yang lebih baik
      if (typeof window !== 'undefined') {
        try {
          const serialized = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
          
          // Verifikasi penyimpanan berhasil
          const checkSaved = window.localStorage.getItem(key);
          if (!checkSaved) {
            console.warn(`Gagal menyimpan item "${key}" ke localStorage.`);
          } else {
            console.log(`Item "${key}" berhasil disimpan ke localStorage.`);
          }
        } catch (serializeError) {
          console.error(`Error serializing item "${key}" for localStorage:`, serializeError);
        }
      }
    } catch (error) {
      console.error(`Error menyimpan localStorage key "${key}":`, error);
    }
  };

  // Sinkronisasi nilai jika key berubah dan tetap perhatikan storage events
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const handleStorageChange = (e) => {
        if (e.key === key) {
          try {
            const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
            setStoredValue(newValue);
          } catch (error) {
            console.error(`Error parsing localStorage change for key "${key}":`, error);
          }
        }
      };
      
      // Initialize dengan nilai dari localStorage jika ada
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          setStoredValue(JSON.parse(item));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}" during initialization:`, error);
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
      
      // Dengarkan perubahan dari tab lain
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch (error) {
      console.error(`Error syncing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;