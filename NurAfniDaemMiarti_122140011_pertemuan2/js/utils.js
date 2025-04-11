// utils.js - fungsi-fungsi utilitas umum
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  
  export function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
  }
  
  export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }