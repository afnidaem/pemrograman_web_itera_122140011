// app.js - file utama aplikasi
import { getAllDompets, createDompet, updateDompet, deleteDompet, getDompetById } from '/js/walletOperations.js';
import { renderDompetCard, renderEmptyState } from '/js/walletRenderer.js';
import { createTransaction, getAllTransactions, deleteTransaction } from '/js/transactionOperations.js';
import { renderTransactionsList, renderTransactionForm } from '/js/transactionRenderer.js';
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from '/js/transactionCategories.js';

document.addEventListener('DOMContentLoaded', function() {
  // Referensi ke elemen-elemen DOM untuk Dompet
  const btnCreateDompet = document.getElementById('btn-create-dompet');
  const formCreateDompet = document.getElementById('form-create-dompet');
  const daftarDompet = document.getElementById('daftar-dompet');
  
  // Referensi ke elemen-elemen DOM untuk Transaksi
  const btnCreateTransaction = document.getElementById('btn-create-transaction');
  const transactionFormContainer = document.getElementById('transaction-form-container');
  const daftarTransaksi = document.getElementById('daftar-transaksi');
  
  // Referensi ke elemen-elemen DOM untuk Pengingat
  const btnCreateReminder = document.getElementById('btn-create-reminder');
  const reminderFormContainer = document.getElementById('reminder-form-container');
  const btnCancelReminder = document.getElementById('cancel-reminder');
  
  // Variable untuk menyimpan ID dompet yang sedang diedit
  let currentEditId = null;
  
  // ================ FUNGSI-FUNGSI UNTUK AKUN DOMPET ================
  
  // Tampilkan/sembunyikan form pembuatan dompet
  btnCreateDompet.addEventListener('click', function() {
    // Reset form jika sedang dalam mode edit
    if (currentEditId) {
      formCreateDompet.reset();
      document.querySelector('#form-create-dompet button[type="submit"]').textContent = 'Buat Dompet';
      currentEditId = null;
    }
    
    formCreateDompet.classList.toggle('hidden');
    if (!formCreateDompet.classList.contains('hidden')) {
      document.getElementById('nama-dompet').focus();
    }
    
    // Sembunyikan form transaksi jika terbuka
    transactionFormContainer.classList.add('hidden');
    
    // Sembunyikan form pengingat jika terbuka
    if (reminderFormContainer) {
      reminderFormContainer.classList.add('hidden');
    }
  });
  
  // Handle form submission untuk membuat atau mengedit dompet
  formCreateDompet.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const namaDompet = document.getElementById('nama-dompet').value.trim();
    const saldoAwal = parseFloat(document.getElementById('saldo-awal').value);
    
    if (!namaDompet) {
      alert('Nama dompet tidak boleh kosong!');
      return;
    }
    
    if (currentEditId) {
      // Mode edit: Update dompet yang sudah ada
      updateDompet(currentEditId, { nama: namaDompet, saldo: saldoAwal });
      currentEditId = null;
    } else {
      // Mode tambah: Buat dompet baru
      createDompet(namaDompet, saldoAwal);
    }
    
    // Reset form
    formCreateDompet.reset();
    formCreateDompet.classList.add('hidden');
    document.querySelector('#form-create-dompet button[type="submit"]').textContent = 'Buat Dompet';
    
    // Refresh tampilan
    renderDompets();
    renderTransactions(); // Juga refresh transaksi karena nama dompet mungkin berubah
  });
  
  // Render daftar dompet
  function renderDompets() {
    const dompets = getAllDompets();
    daftarDompet.innerHTML = '';
    
    if (dompets.length === 0) {
      renderEmptyState(daftarDompet);
      return;
    }
    
    dompets.forEach(dompet => {
      const dompetCard = renderDompetCard(dompet);
      daftarDompet.appendChild(dompetCard);
    });
    
    // Tambahkan event listener untuk tombol edit
    document.querySelectorAll('.edit-dompet').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        editDompet(id);
      });
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.delete-dompet').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        handleDeleteDompet(id);
      });
    });
  }
  
  // Fungsi untuk mengedit dompet
  function editDompet(id) {
    const dompet = getDompetById(id);
    
    if (dompet) {
      // Isi form dengan data dompet yang akan diedit
      document.getElementById('nama-dompet').value = dompet.nama;
      document.getElementById('saldo-awal').value = dompet.saldo;
      
      // Ubah teks tombol submit
      document.querySelector('#form-create-dompet button[type="submit"]').textContent = 'Perbarui Dompet';
      
      // Tampilkan form dan simpan ID yang sedang diedit
      formCreateDompet.classList.remove('hidden');
      currentEditId = id;
      
      // Scroll ke form
      formCreateDompet.scrollIntoView({ behavior: 'smooth' });
      
      // Sembunyikan form transaksi jika terbuka
      transactionFormContainer.classList.add('hidden');
      
      // Sembunyikan form pengingat jika terbuka
      if (reminderFormContainer) {
        reminderFormContainer.classList.add('hidden');
      }
    }
  }
  
  // Fungsi untuk menghapus dompet
  function handleDeleteDompet(id) {
    // Pengecekan apakah ada transaksi yang terkait dengan dompet ini
    const transactions = getAllTransactions();
    const relatedTransactions = transactions.filter(t => t.walletId === id);
    
    if (relatedTransactions.length > 0) {
      alert('Tidak dapat menghapus akun dompet ini karena masih memiliki transaksi terkait. Hapus semua transaksi terkait terlebih dahulu.');
      return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus akun dompet ini?')) {
      deleteDompet(id);
      renderDompets();
    }
  }
  
  // ================ FUNGSI-FUNGSI UNTUK TRANSAKSI ================
  
  // Tampilkan/sembunyikan form pembuatan transaksi
  btnCreateTransaction.addEventListener('click', function() {
    // Cek apakah ada dompet
    const dompets = getAllDompets();
    if (dompets.length === 0) {
      alert('Anda harus membuat akun dompet terlebih dahulu sebelum menambahkan transaksi.');
      return;
    }
    
    // Toggle form
    transactionFormContainer.classList.toggle('hidden');
    
    if (!transactionFormContainer.classList.contains('hidden')) {
      // Render form transaksi
      transactionFormContainer.innerHTML = '';
      const form = renderTransactionForm(dompets);
      transactionFormContainer.appendChild(form);
      
      // Setup event listeners untuk form transaksi
      setupTransactionFormEvents();
      
      // Scroll ke form
      transactionFormContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Sembunyikan form dompet jika terbuka
    formCreateDompet.classList.add('hidden');
    
    // Sembunyikan form pengingat jika terbuka
    if (reminderFormContainer) {
      reminderFormContainer.classList.add('hidden');
    }
  });
  
  // Setup event listeners untuk form transaksi
  function setupTransactionFormEvents() {
    const form = document.getElementById('form-create-transaction');
    const typeSelect = document.getElementById('transaction-type');
    const categorySelect = document.getElementById('transaction-category');
    const cancelBtn = document.getElementById('cancel-transaction');
    
    // Handle perubahan tipe transaksi
    typeSelect.addEventListener('change', function() {
      const selectedType = this.value;
      
      if (selectedType) {
        // Aktifkan select kategori
        categorySelect.disabled = false;
        
        // Reset opsi kategori
        categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
        
        // Tambahkan kategori berdasarkan tipe yang dipilih
        TRANSACTION_CATEGORIES[selectedType].forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      } else {
        // Nonaktifkan select kategori jika tidak ada tipe yang dipilih
        categorySelect.disabled = true;
        categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
      }
    });
    
    // Handle tombol cancel
    cancelBtn.addEventListener('click', function() {
      transactionFormContainer.classList.add('hidden');
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validasi form
      const title = document.getElementById('transaction-title').value.trim();
      const type = typeSelect.value;
      const category = categorySelect.value;
      const walletId = document.getElementById('transaction-wallet').value;
      const amount = parseFloat(document.getElementById('transaction-amount').value);
      const datetime = document.getElementById('transaction-datetime').value;
      
      if (!title || !type || !category || !walletId || isNaN(amount) || amount <= 0 || !datetime) {
        alert('Semua field harus diisi dengan benar!');
        return;
      }
      
      // Simpan transaksi
      try {
        createTransaction({
          title,
          type,
          category,
          walletId,
          amount,
          datetime: new Date(datetime).toISOString()
        });
        
        // Reset form
        form.reset();
        transactionFormContainer.classList.add('hidden');
        
        // Refresh tampilan
        renderDompets(); // Update saldo dompet
        renderTransactions(); // Update daftar transaksi
        
        alert('Transaksi berhasil disimpan!');
      } catch (error) {
        alert(error.message);
      }
    });
  }
  
  // Render daftar transaksi
  function renderTransactions() {
    const transactions = getAllTransactions();
    const dompets = getAllDompets();
    
    daftarTransaksi.innerHTML = '';
    
    // Render daftar transaksi
    const transactionList = renderTransactionsList(transactions, dompets);
    daftarTransaksi.appendChild(transactionList);
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.delete-transaction').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        handleDeleteTransaction(id);
      });
    });
  }
  
  // Fungsi untuk menghapus transaksi
  function handleDeleteTransaction(id) {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        deleteTransaction(id);
        renderDompets(); // Update saldo dompet
        renderTransactions(); // Update daftar transaksi
        alert('Transaksi berhasil dihapus!');
      } catch (error) {
        alert(error.message);
      }
    }
  }
  
  // ================ FUNGSI-FUNGSI UNTUK PENGINGAT ================
  
  // Tambahkan event listener untuk tombol tambah pengingat
  if (btnCreateReminder) {
    console.log("Tombol pengingat ditemukan dan event listener ditambahkan");
    btnCreateReminder.addEventListener('click', function() {
      console.log("Tombol pengingat diklik");
      toggleReminderForm();
    });
  } else {
    console.log("Tombol pengingat tidak ditemukan", document.getElementById('btn-create-reminder'));
  }
  
  // Tambahkan event listener untuk tombol batal pada form pengingat
  if (btnCancelReminder) {
    btnCancelReminder.addEventListener('click', toggleReminderForm);
  }
  
  // Fungsi untuk menampilkan/menyembunyikan form pengingat
  function toggleReminderForm() {
    console.log("Fungsi toggleReminderForm dipanggil");
    
    // Sembunyikan form dompet jika terbuka
    formCreateDompet.classList.add('hidden');
    
    // Sembunyikan form transaksi jika terbuka
    transactionFormContainer.classList.add('hidden');
    
    // Toggle form pengingat
    if (reminderFormContainer) {
      console.log("Status form pengingat sebelum toggle:", reminderFormContainer.classList.contains('hidden') ? "tersembunyi" : "terlihat");
      reminderFormContainer.classList.toggle('hidden');
      console.log("Status form pengingat setelah toggle:", reminderFormContainer.classList.contains('hidden') ? "tersembunyi" : "terlihat");
      
      if (!reminderFormContainer.classList.contains('hidden')) {
        // Scroll ke form
        reminderFormContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      console.log("reminderFormContainer tidak ditemukan");
    }
  }
  
  // ================ INISIALISASI APLIKASI ================
  
  // Load dompets dan transaksi saat halaman dimuat
  renderDompets();
  renderTransactions();
  
  // Log untuk debugging
  console.log("DOM Content Loaded - app.js", {
    btnCreateReminder: btnCreateReminder,
    reminderFormContainer: reminderFormContainer,
    btnCancelReminder: btnCancelReminder
  });
});