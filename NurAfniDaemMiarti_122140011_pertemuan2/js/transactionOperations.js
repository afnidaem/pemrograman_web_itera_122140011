// transactionOperations.js - operasi untuk transaksi
import { generateId } from '/js/utils.js';
import { getTransactionsFromStorage, saveTransactionsToStorage } from '/js/transactionStorage.js';
import { getDompetById, updateDompet } from '/js/walletOperations.js';

export function createTransaction(data) {
  const transactions = getTransactionsFromStorage();
  
  const newTransaction = {
    id: generateId(),
    title: data.title,
    type: data.type,
    category: data.category,
    amount: data.amount,
    walletId: data.walletId,
    datetime: data.datetime || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  
  // Update wallet balance
  const wallet = getDompetById(data.walletId);
  
  if (wallet) {
    let newBalance = wallet.saldo;
    
    if (data.type === 'income') {
      newBalance += parseFloat(data.amount);
    } else if (data.type === 'expense') {
      newBalance -= parseFloat(data.amount);
    }
    
    // Pastikan saldo tidak negatif
    if (newBalance < 0) {
      throw new Error("Saldo tidak mencukupi untuk transaksi ini");
    }
    
    // Update saldo dompet
    updateDompet(data.walletId, { saldo: newBalance });
  } else {
    throw new Error("Akun dompet tidak ditemukan");
  }
  
  transactions.push(newTransaction);
  saveTransactionsToStorage(transactions);
  
  return newTransaction;
}

export function getAllTransactions() {
  return getTransactionsFromStorage();
}

export function getTransactionsByWalletId(walletId) {
  const transactions = getTransactionsFromStorage();
  return transactions.filter(transaction => transaction.walletId === walletId);
}

export function deleteTransaction(id) {
  // Dapatkan transaksi yang akan dihapus
  const transactions = getTransactionsFromStorage();
  const transaction = transactions.find(t => t.id === id);
  
  if (!transaction) {
    throw new Error("Transaksi tidak ditemukan");
  }
  
  // Reversi pengaruh transaksi pada saldo dompet
  const wallet = getDompetById(transaction.walletId);
  
  if (wallet) {
    let newBalance = wallet.saldo;
    
    // Jika transaksi adalah pemasukan, kurangi saldo
    // Jika transaksi adalah pengeluaran, tambahkan saldo
    if (transaction.type === 'income') {
      newBalance -= parseFloat(transaction.amount);
    } else if (transaction.type === 'expense') {
      newBalance += parseFloat(transaction.amount);
    }
    
    // Update saldo dompet
    updateDompet(transaction.walletId, { saldo: newBalance });
  }
  
  // Hapus transaksi
  const updatedTransactions = transactions.filter(t => t.id !== id);
  saveTransactionsToStorage(updatedTransactions);
  
  return updatedTransactions;
}