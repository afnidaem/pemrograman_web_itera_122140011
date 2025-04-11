
// transactionStorage.js - penyimpanan untuk transaksi
export function getTransactionsFromStorage() {
    const transactionsJSON = localStorage.getItem('transactions');
    return transactionsJSON ? JSON.parse(transactionsJSON) : [];
  }
  
  export function saveTransactionsToStorage(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }