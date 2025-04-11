// transactionRenderer.js - rendering transaksi ke UI
import { formatRupiah, formatDate } from '/js/utils.js';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '/js/transactionCategories.js';
import { getAllDompets } from '/js/walletOperations.js';

export function renderTransactionsList(transactions, dompets) {
  const transactionsList = document.createElement('div');
  transactionsList.className = 'space-y-3 mt-4';
  
  if (transactions.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'text-center py-8 text-gray-500';
    emptyState.textContent = 'Belum ada transaksi. Silakan tambahkan transaksi baru.';
    return emptyState;
  }
  
  // Urutkan transaksi dari yang terbaru
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.datetime) - new Date(a.datetime)
  );
  
  sortedTransactions.forEach(transaction => {
    const walletName = dompets.find(d => d.id === transaction.walletId)?.nama || 'Dompet tidak ditemukan';
    const categoryObj = TRANSACTION_CATEGORIES[transaction.type].find(c => c.id === transaction.category);
    const categoryName = categoryObj ? categoryObj.name : transaction.category;
    
    const transactionItem = document.createElement('div');
    transactionItem.className = `p-4 bg-white rounded-lg shadow border ${
      transaction.type === TRANSACTION_TYPES.INCOME ? 'border-green-200' : 'border-red-200'
    }`;
    
    transactionItem.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-medium text-gray-800">${transaction.title}</h4>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span>${categoryName}</span>
            <span>•</span>
            <span>${walletName}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">${formatDate(transaction.datetime)}</div>
        </div>
        <div class="flex items-center">
          <span class="font-bold ${
            transaction.type === TRANSACTION_TYPES.INCOME ? 'text-green-600' : 'text-red-600'
          }">
            ${transaction.type === TRANSACTION_TYPES.INCOME ? '+' : '-'} Rp ${formatRupiah(transaction.amount)}
          </span>
          <button class="delete-transaction ml-3 text-red-500 hover:text-red-700" data-id="${transaction.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `;
    
    transactionsList.appendChild(transactionItem);
  });
  
  return transactionsList;
}

export function renderTransactionForm(dompets) {
  const form = document.createElement('form');
  form.id = 'form-create-transaction';
  form.className = 'space-y-4 mb-6 bg-white p-4 rounded-lg shadow';
  
  form.innerHTML = `
    <h3 class="font-bold text-lg text-gray-800 mb-3">Tambah Transaksi Baru</h3>
    
    <div>
        <label for="transaction-title" class="block text-gray-700">Judul Transaksi:</label>
        <input type="text" id="transaction-title" name="transaction-title" required 
               class="w-full p-2 mt-1 border border-gray-300 rounded-lg" 
               placeholder="Masukkan judul transaksi">
    </div>

    <div>
        <label for="transaction-type" class="block text-gray-700">Tipe Transaksi:</label>
        <select id="transaction-type" name="transaction-type" required 
                class="w-full p-2 mt-1 border border-gray-300 rounded-lg">
            <option value="">-- Pilih Tipe Transaksi --</option>
            <option value="${TRANSACTION_TYPES.INCOME}">Pemasukan</option>
            <option value="${TRANSACTION_TYPES.EXPENSE}">Pengeluaran</option>
        </select>
    </div>

    <div>
        <label for="transaction-category" class="block text-gray-700">Kategori:</label>
        <select id="transaction-category" name="transaction-category" required 
                class="w-full p-2 mt-1 border border-gray-300 rounded-lg" disabled>
            <option value="">-- Pilih Kategori --</option>
        </select>
    </div>

    <div>
        <label for="transaction-wallet" class="block text-gray-700">Akun Dompet:</label>
        <select id="transaction-wallet" name="transaction-wallet" required 
                class="w-full p-2 mt-1 border border-gray-300 rounded-lg">
            <option value="">-- Pilih Akun Dompet --</option>
            ${dompets.map(dompet => `
                <option value="${dompet.id}">${dompet.nama} (Rp ${formatRupiah(dompet.saldo)})</option>
            `).join('')}
        </select>
    </div>

    <div>
        <label for="transaction-amount" class="block text-gray-700">Jumlah Transaksi:</label>
        <input type="number" id="transaction-amount" name="transaction-amount" required 
               class="w-full p-2 mt-1 border border-gray-300 rounded-lg" 
               placeholder="Masukkan jumlah transaksi" min="1">
    </div>

    <div>
        <label for="transaction-datetime" class="block text-gray-700">Tanggal dan Waktu:</label>
        <input type="datetime-local" id="transaction-datetime" name="transaction-datetime" required 
               class="w-full p-2 mt-1 border border-gray-300 rounded-lg" 
               value="${new Date().toISOString().slice(0, 16)}">
    </div>

    <div class="flex space-x-2 pt-2">
        <button type="submit" 
                class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Simpan Transaksi
        </button>
        <button type="button" id="cancel-transaction"
                class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition">
            Batal
        </button>
    </div>
  `;
  
  return form;
}