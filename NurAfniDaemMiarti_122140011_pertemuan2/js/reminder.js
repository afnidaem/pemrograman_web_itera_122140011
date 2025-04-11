// reminder.js - File untuk menangani fitur pengingat dengan Google Calendar

// Konfigurasi API Google Calendar
const CLIENT_ID = '1089824538886-n7teishjfj9hrmfpb8edq9kfi7l73fsm.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCaAI7JvDLbXoIwUld3bW8npmCfKizim58';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const btnAuthorize = document.getElementById('btn-authorize');
  const btnSignout = document.getElementById('btn-signout');
  const btnCreateReminder = document.getElementById('btn-create-reminder');
  const reminderFormContainer = document.getElementById('reminder-form-container');
  const googleApiStatus = document.getElementById('google-api-status');
  const formCreateReminder = document.getElementById('form-create-reminder');
  const btnCancelReminder = document.getElementById('cancel-reminder');
  const daftarPengingat = document.getElementById('daftar-pengingat');
  const emptyReminderMessage = document.getElementById('empty-reminder-message');
  
  // Inisialisasi API Google
  initializeGoogleAPI();

  // Event listener untuk tombol tambah pengingat
  if (btnCreateReminder) {
    btnCreateReminder.addEventListener('click', toggleReminderForm);
  }
  
  // Event listener untuk tombol batal pada form pengingat
  if (btnCancelReminder) {
    btnCancelReminder.addEventListener('click', toggleReminderForm);
  }
  
  // Event listener untuk formulir pengingat
  if (formCreateReminder) {
    formCreateReminder.addEventListener('submit', handleCreateReminder);
  }
  
  // Tambahkan tombol sinkronisasi
  addSyncButton();
});

// Toggle form pengingat
function toggleReminderForm() {
  const reminderFormContainer = document.getElementById('reminder-form-container');
  const formCreateDompet = document.getElementById('form-create-dompet');
  const transactionFormContainer = document.getElementById('transaction-form-container');
  const formCreateReminder = document.getElementById('form-create-reminder');
  
  // Sembunyikan form lain jika terbuka
  if (formCreateDompet) {
    formCreateDompet.classList.add('hidden');
  }
  
  if (transactionFormContainer) {
    transactionFormContainer.classList.add('hidden');
  }
  
  // Toggle form pengingat
  if (reminderFormContainer) {
    if (reminderFormContainer.classList.contains('hidden')) {
      reminderFormContainer.classList.remove('hidden');
      
      // Scroll ke form
      reminderFormContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      reminderFormContainer.classList.add('hidden');
      if (formCreateReminder) {
        formCreateReminder.reset();
      }
    }
  }
}

// Inisialisasi API Google Calendar
function initializeGoogleAPI() {
  // Cek apakah API script sudah dimuat
  if (typeof gapi === 'undefined' || typeof google === 'undefined') {
    console.warn('Google API belum dimuat sepenuhnya. Pengingat akan diinisialisasi setelah dimuat.');
    
    // Tampilkan pesan loading di status
    const googleApiStatus = document.getElementById('google-api-status');
    if (googleApiStatus) {
      googleApiStatus.classList.remove('hidden');
      googleApiStatus.textContent = 'Memuat Google Calendar API...';
    }
    
    // Set interval untuk menunggu API dimuat
    const apiCheckInterval = setInterval(() => {
      if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
        clearInterval(apiCheckInterval);
        gapiLoaded();
        gisLoaded();
        checkAuthStatus();
      }
    }, 500);
    
    return;
  }
  
  gapiLoaded();
  gisLoaded();
  
  // Cek status login Google
  checkAuthStatus();
  
  // Tampilkan pesan kosong jika belum ada pengingat
  checkEmptyReminders();
}

// Inisialisasi Google API Client
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
  } catch (error) {
    console.error('Error saat inisialisasi Google API Client:', error);
    showApiError();
  }
}

// Inisialisasi Google Identity Services
function gisLoaded() {
  try {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // Akan didefinisikan kemudian
    });
    gisInited = true;
    maybeEnableButtons();
  } catch (error) {
    console.error('Error saat inisialisasi Google Identity Services:', error);
    showApiError();
  }
}

// Tampilkan error jika terjadi masalah dengan API
function showApiError() {
  const googleApiStatus = document.getElementById('google-api-status');
  if (googleApiStatus) {
    googleApiStatus.classList.remove('hidden');
    googleApiStatus.classList.remove('bg-yellow-100', 'text-yellow-800');
    googleApiStatus.classList.add('bg-red-100', 'text-red-800');
    googleApiStatus.textContent = 'Terjadi masalah saat menghubungkan ke Google Calendar API. Periksa kunci API Anda.';
  }
}

// Aktifkan tombol jika API sudah siap
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    const btnAuthorize = document.getElementById('btn-authorize');
    const btnSignout = document.getElementById('btn-signout');
    
    if (btnAuthorize) {
      btnAuthorize.classList.remove('hidden');
      btnAuthorize.addEventListener('click', handleAuthClick);
    }
    
    if (btnSignout) {
      btnSignout.addEventListener('click', handleSignoutClick);
    }
    
    // Cek status login
    checkAuthStatus();
  }
}

// Cek apakah pengguna sudah login ke Google
function checkAuthStatus() {
  const token = localStorage.getItem('gapi_access_token');
  const expiry = localStorage.getItem('gapi_token_expiry');
  
  if (token && expiry && new Date().getTime() < parseInt(expiry)) {
    // Token masih valid
    handleSignedIn();
  } else {
    // Token tidak valid atau belum login
    handleNotSignedIn();
    
    // Hapus token yang expired
    if (token) {
      localStorage.removeItem('gapi_access_token');
      localStorage.removeItem('gapi_token_expiry');
    }
  }
}

// Handler untuk tampilan saat user sudah login
function handleSignedIn() {
  const btnAuthorize = document.getElementById('btn-authorize');
  const btnSignout = document.getElementById('btn-signout');
  const googleApiStatus = document.getElementById('google-api-status');
  const btnCreateReminder = document.getElementById('btn-create-reminder');
  const btnSyncCalendar = document.getElementById('btn-sync-calendar');
  
  if (btnAuthorize) btnAuthorize.classList.add('hidden');
  if (btnSignout) btnSignout.classList.remove('hidden');
  if (googleApiStatus) googleApiStatus.classList.add('hidden');
  if (btnCreateReminder) btnCreateReminder.disabled = false;
  if (btnSyncCalendar) btnSyncCalendar.classList.remove('hidden');
  
  // Load pengingat dari localStorage
  loadReminders();
  
  // Lakukan sinkronisasi otomatis saat user signin
  syncWithGoogleCalendar();
  
  // Setup sinkronisasi otomatis
  setupAutoSync();
}

// Handler untuk tampilan saat user belum login
function handleNotSignedIn() {
  const btnAuthorize = document.getElementById('btn-authorize');
  const btnSignout = document.getElementById('btn-signout');
  const googleApiStatus = document.getElementById('google-api-status');
  const btnCreateReminder = document.getElementById('btn-create-reminder');
  const btnSyncCalendar = document.getElementById('btn-sync-calendar');
  
  if (btnAuthorize) btnAuthorize.classList.remove('hidden');
  if (btnSignout) btnSignout.classList.add('hidden');
  if (googleApiStatus) {
    googleApiStatus.classList.remove('hidden');
    googleApiStatus.classList.remove('bg-red-100', 'text-red-800');
    googleApiStatus.classList.add('bg-yellow-100', 'text-yellow-800');
    googleApiStatus.textContent = 'Silakan hubungkan dengan Google Calendar untuk mengaktifkan fitur pengingat.';
  }
  if (btnCreateReminder) btnCreateReminder.disabled = true;
  if (btnSyncCalendar) btnSyncCalendar.classList.add('hidden');
}

// Handler untuk login ke Google
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    
    // Simpan token di localStorage
    localStorage.setItem('gapi_access_token', resp.access_token);
    localStorage.setItem('gapi_token_expiry', new Date().getTime() + (resp.expires_in * 1000));
    
    handleSignedIn();
  };

  if (gapi.client.getToken() === null) {
    // Meminta user untuk memilih akun
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip consent prompt
    tokenClient.requestAccessToken({prompt: ''});
  }
}

// Handler untuk logout dari Google
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    
    // Hapus token dari localStorage
    localStorage.removeItem('gapi_access_token');
    localStorage.removeItem('gapi_token_expiry');
    
    handleNotSignedIn();
  }
}

// Buat pengingat baru
async function handleCreateReminder(e) {
  e.preventDefault();
  
  // Dapatkan nilai dari form
  const title = document.getElementById('reminder-title').value;
  const amount = document.getElementById('reminder-amount').value;
  const date = document.getElementById('reminder-date').value;
  const time = document.getElementById('reminder-time').value;
  const notificationMinutes = document.getElementById('reminder-notification').value;
  const notes = document.getElementById('reminder-notes').value;
  
  // Format tanggal dan waktu untuk Google Calendar
  const dateTime = `${date}T${time}:00`;
  
  // Dapatkan ID pengingat baru
  const reminderId = 'reminder_' + new Date().getTime();
  
  // Buat event Google Calendar
  try {
    const event = {
      'summary': title,
      'description': `Pembayaran: Rp ${parseInt(amount).toLocaleString('id-ID')}\n\n${notes}`,
      'start': {
        'dateTime': dateTime,
        'timeZone': 'Asia/Jakarta'
      },
      'end': {
        'dateTime': dateTime,
        'timeZone': 'Asia/Jakarta'
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': parseInt(notificationMinutes)},
          {'method': 'popup', 'minutes': parseInt(notificationMinutes)}
        ]
      }
    };
    
    // Tambahkan event ke Google Calendar
    const calendarResponse = await gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
    
    // Simpan data pengingat ke localStorage
    const reminderData = {
      id: reminderId,
      title: title,
      amount: amount,
      dateTime: dateTime,
      notificationMinutes: notificationMinutes,
      notes: notes,
      calendarEventId: calendarResponse.result.id,
      status: 'pending' // pending, completed, atau cancelled
    };
    
    saveReminder(reminderData);
    
    // Reset form dan sembunyikan
    document.getElementById('form-create-reminder').reset();
    document.getElementById('reminder-form-container').classList.add('hidden');
    
    // Tampilkan notifikasi sukses
    alert('Pengingat berhasil dibuat dan ditambahkan ke Google Calendar Anda!');
    
  } catch (error) {
    console.error('Error saat membuat event di Google Calendar:', error);
    alert('Gagal menambahkan pengingat ke Google Calendar. Silakan coba lagi.');
  }
}

// Simpan pengingat ke localStorage
function saveReminder(reminderData) {
  let reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  reminders.push(reminderData);
  localStorage.setItem('dompetku_reminders', JSON.stringify(reminders));
  
  // Perbarui tampilan daftar pengingat
  renderReminder(reminderData);
  checkEmptyReminders();
}

// Hapus pengingat
async function deleteReminder(reminderId) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengingat ini?')) {
    return;
  }
  
  let reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);
  
  if (reminderIndex !== -1) {
    const reminder = reminders[reminderIndex];
    
    // Hapus event dari Google Calendar jika ada ID event
    if (reminder.calendarEventId && gapi.client && gapi.client.getToken()) {
      try {
        await gapi.client.calendar.events.delete({
          'calendarId': 'primary',
          'eventId': reminder.calendarEventId
        });
      } catch (error) {
        console.error('Error saat menghapus event dari Google Calendar:', error);
      }
    }
    
    // Hapus dari array dan update localStorage
    reminders.splice(reminderIndex, 1);
    localStorage.setItem('dompetku_reminders', JSON.stringify(reminders));
    
    // Hapus dari DOM
    const reminderElement = document.getElementById(reminderId);
    if (reminderElement) {
      reminderElement.remove();
    }
    
    checkEmptyReminders();
  }
}

// Ubah status pengingat (pending, completed, cancelled)
async function updateReminderStatus(reminderId, newStatus) {
  let reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);
  
  if (reminderIndex !== -1) {
    const reminder = reminders[reminderIndex];
    
    // Update status di objek reminder
    reminder.status = newStatus;
    
    // Update event di Google Calendar jika ada ID event
    if (reminder.calendarEventId && gapi.client && gapi.client.getToken()) {
      try {
        // Dapatkan event dari Google Calendar
        const response = await gapi.client.calendar.events.get({
          'calendarId': 'primary',
          'eventId': reminder.calendarEventId
        });
        
        const event = response.result;
        
        // Update deskripsi event dengan status baru
        let updatedDescription = event.description || '';
        
        // Hapus status yang mungkin sudah ada
        updatedDescription = updatedDescription.replace(/\[Status: [^\]]+\]/g, '');
        
        // Tambahkan status baru
        const statusText = getStatusText(newStatus);
        updatedDescription += `\n\n[Status: ${statusText}]`;
        
        // Update event di Google Calendar
        await gapi.client.calendar.events.patch({
          'calendarId': 'primary',
          'eventId': reminder.calendarEventId,
          'resource': {
            'description': updatedDescription,
            // Ubah warna event berdasarkan status
            'colorId': getGoogleCalendarColorId(newStatus)
          }
        });
        
        console.log('Event berhasil diupdate di Google Calendar');
      } catch (error) {
        console.error('Error saat mengupdate event di Google Calendar:', error);
      }
    }
    
    // Update localStorage
    localStorage.setItem('dompetku_reminders', JSON.stringify(reminders));
    
    // Update tampilan
    const reminderElement = document.getElementById(reminderId);
    if (reminderElement) {
      // Hapus class status lama
      reminderElement.classList.remove('border-yellow-300', 'border-green-300', 'border-red-300');
      
      // Tambahkan class status baru
      reminderElement.classList.add(getStatusBorderClass(newStatus));
      
      // Update text status
      const statusElement = reminderElement.querySelector('.reminder-status');
      if (statusElement) {
        statusElement.textContent = getStatusText(newStatus);
        statusElement.className = 'reminder-status px-2 py-1 text-xs rounded-full ' + getStatusClass(newStatus);
      }
    }
  }
}

// Muat daftar pengingat dari localStorage
function loadReminders() {
  const daftarPengingat = document.getElementById('daftar-pengingat');
  const emptyReminderMessage = document.getElementById('empty-reminder-message');
  
  if (!daftarPengingat || !emptyReminderMessage) return;
  
  // Bersihkan tampilan pengingat
  daftarPengingat.innerHTML = '';
  
  // Tampilkan pesan jika kosong
  emptyReminderMessage.classList.remove('hidden');
  
  // Ambil data dari localStorage
  const reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  
  // Render setiap pengingat
  reminders.forEach(reminder => {
    renderReminder(reminder);
  });
  
  // Cek jika ada pengingat
  checkEmptyReminders();
}

// Render pengingat ke DOM
function renderReminder(reminder) {
  const daftarPengingat = document.getElementById('daftar-pengingat');
  if (!daftarPengingat) return;
  
  // Format tanggal
  const reminderDate = new Date(reminder.dateTime);
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(reminderDate);
  
  // Status class
  const statusClass = getStatusClass(reminder.status);
  const statusText = getStatusText(reminder.status);
  
  // Format jumlah uang
  const formattedAmount = parseInt(reminder.amount).toLocaleString('id-ID');
  
  // Buat element pengingat
  const reminderElement = document.createElement('div');
  reminderElement.id = reminder.id;
  reminderElement.className = `bg-white p-4 rounded-lg shadow border-l-4 ${getStatusBorderClass(reminder.status)}`;
  
  reminderElement.innerHTML = `
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-bold text-lg">${reminder.title}</h3>
        <p class="text-gray-600 text-sm">Rp ${formattedAmount}</p>
        <p class="text-gray-500 text-xs mt-1">${formattedDate}</p>
        <p class="text-gray-500 text-xs mt-2">${reminder.notes}</p>
      </div>
      <div class="flex flex-col items-end">
        <span class="reminder-status ${statusClass} px-2 py-1 text-xs rounded-full">${statusText}</span>
        <div class="flex mt-2 space-x-2">
          <div class="relative inline-block text-left">
            <button type="button" class="status-dropdown-btn p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="status-dropdown hidden absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div class="py-1">
                <button class="status-option block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-status="pending">Belum Dibayar</button>
                <button class="status-option block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-status="completed">Sudah Dibayar</button>
                <button class="status-option block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-status="cancelled">Dibatalkan</button>
              </div>
            </div>
          </div>
          <button type="button" class="delete-reminder p-2 rounded-full hover:bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Tambahkan ke DOM
  daftarPengingat.appendChild(reminderElement);
  
  // Event listeners untuk tombol-tombol
  
  // Dropdown status
  const statusDropdownBtn = reminderElement.querySelector('.status-dropdown-btn');
  const statusDropdown = reminderElement.querySelector('.status-dropdown');
  
  statusDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Mencegah event menggelembung ke document
    statusDropdown.classList.toggle('hidden');
  });
  
  // Klik di luar dropdown untuk menutup
  document.addEventListener('click', (event) => {
    if (!statusDropdownBtn.contains(event.target) && !statusDropdown.contains(event.target)) {
      statusDropdown.classList.add('hidden');
    }
  });
  
  // Opsi status
  const statusOptions = reminderElement.querySelectorAll('.status-option');
  statusOptions.forEach(option => {
    option.addEventListener('click', () => {
      const newStatus = option.dataset.status;
      updateReminderStatus(reminder.id, newStatus);
      statusDropdown.classList.add('hidden');
    });
  });
  
  // Tombol hapus
  const deleteButton = reminderElement.querySelector('.delete-reminder');
  deleteButton.addEventListener('click', () => {
    deleteReminder(reminder.id);
  });
}

// Cek jika daftar pengingat kosong
function checkEmptyReminders() {
  const reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  const emptyReminderMessage = document.getElementById('empty-reminder-message');
  
  if (!emptyReminderMessage) return;
  
  if (reminders.length === 0) {
    emptyReminderMessage.classList.remove('hidden');
  } else {
    emptyReminderMessage.classList.add('hidden');
  }
}

// Helper functions untuk mendapatkan class berdasarkan status
function getStatusBorderClass(status) {
  switch (status) {
    case 'pending':
      return 'border-yellow-300';
    case 'completed':
      return 'border-green-300';
    case 'cancelled':
      return 'border-red-300';
    default:
      return 'border-yellow-300';
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'pending':
      return 'Belum Dibayar';
    case 'completed':
      return 'Sudah Dibayar';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return 'Belum Dibayar';
  }
}

// Fungsi untuk mendapatkan ID warna Google Calendar berdasarkan status
function getGoogleCalendarColorId(status) {
  // Google Calendar colorId:
  // 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana
  // 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
  switch (status) {
    case 'pending':
      return '5'; // Banana (Kuning)
    case 'completed':
      return '10'; // Basil (Hijau)
    case 'cancelled':
      return '11'; // Tomato (Merah)
    default:
      return '5'; // Default: Banana
  }
}

// ================ FUNGSI SINKRONISASI DENGAN GOOGLE CALENDAR ================

// Tambahkan tombol sinkronisasi
function addSyncButton() {
  // Cek apakah sudah ada tombol sinkronisasi
  if (document.getElementById('btn-sync-calendar')) {
    return;
  }
  
  // Ambil container tombol (di samping btn-create-reminder)
  const btnContainer = document.querySelector('#pengingat .flex.justify-between');
  
  if (btnContainer) {
    // Buat div untuk tombol
    const syncButtonContainer = document.createElement('div');
    syncButtonContainer.className = 'flex space-x-2';
    
    // Cek apakah sudah ada div flex space-x-2
    const existingContainer = btnContainer.querySelector('.flex.space-x-2');
    if (existingContainer) {
      // Tambahkan tombol ke container yang sudah ada
      const syncButton = createSyncButton();
      existingContainer.appendChild(syncButton);
    } else {
      // Buat tombol sinkronisasi
      const syncButton = createSyncButton();
      syncButtonContainer.appendChild(syncButton);
      
      // Tambahkan container ke btnContainer
      btnContainer.appendChild(syncButtonContainer);
    }
  }
}

// Buat tombol sinkronisasi
function createSyncButton() {
  const syncButton = document.createElement('button');
  syncButton.id = 'btn-sync-calendar';
  syncButton.className = 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center hidden'; // Hidden by default
  syncButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    Sinkronkan
  `;
  
  // Tambahkan event listener
  syncButton.addEventListener('click', async function() {
    this.disabled = true;
    this.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Menyinkronkan...
    `;
    
    const success = await syncWithGoogleCalendar();
    
    if (success) {
      this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Tersinkron
      `;
      
      // Tampilkan status sinkronisasi berhasil
      const syncStatus = document.getElementById('sync-status');
      if (syncStatus) {
        syncStatus.textContent = 'Sinkronisasi berhasil dilakukan';
        syncStatus.classList.remove('hidden', 'bg-red-100', 'text-red-800');
        syncStatus.classList.add('bg-green-100', 'text-green-800');
        
        // Sembunyikan status setelah 3 detik
        setTimeout(() => {
          syncStatus.classList.add('hidden');
        }, 3000);
      }
      
      // Reset tombol setelah 2 detik
      setTimeout(() => {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sinkronkan
        `;
        this.disabled = false;
      }, 2000);
    } else {
      this.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Gagal
      `;
      
      // Tampilkan status sinkronisasi gagal
      const syncStatus = document.getElementById('sync-status');
      if (syncStatus) {
        syncStatus.textContent = 'Sinkronisasi gagal, coba lagi nanti';
        syncStatus.classList.remove('hidden', 'bg-green-100', 'text-green-800');
        syncStatus.classList.add('bg-red-100', 'text-red-800');
        
        // Sembunyikan status setelah 3 detik
        setTimeout(() => {
          syncStatus.classList.add('hidden');
        }, 3000);
      }
      
      // Reset tombol setelah 2 detik
      setTimeout(() => {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sinkronkan
        `;
        this.disabled = false;
      }, 2000);
    }
  });
  
  return syncButton;
}

// Fungsi untuk mengambil event dari Google Calendar dan menyinkronkannya dengan data lokal
async function syncWithGoogleCalendar() {
  // Pastikan user sudah login ke Google
  if (!gapi.client || !gapi.client.getToken()) {
    console.log("Tidak dapat menyinkronkan, user belum login ke Google");
    return false;
  }
  
  try {
    // Dapatkan waktu sekarang
    const now = new Date();
    
    // Dapatkan waktu 6 bulan ke depan
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(now.getMonth() + 6);
    
    // Format waktu untuk API
    const timeMin = now.toISOString();
    const timeMax = sixMonthsFromNow.toISOString();
    
    console.log("Mengambil event dari Google Calendar...");
    
    // Panggil Google Calendar API untuk mendapatkan semua event
    const response = await gapi.client.calendar.events.list({
      'calendarId': 'primary', // Kalender utama user
      'timeMin': timeMin,
      'timeMax': timeMax,
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'startTime',
      // Filter dengan prefix dari deskripsi untuk mengidentifikasi event yang dibuat oleh aplikasi kita
      'q': 'Pembayaran: Rp' // Prefix yang kita gunakan di deskripsi
    });
    
    console.log("Event dari Google Calendar:", response.result.items);
    
    // Dapatkan daftar event dari hasil API
    const events = response.result.items;
    
    // Dapatkan pengingat lokal
    let localReminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
    
    // Daftar untuk menyimpan ID event dari API
    const calendarEventIds = [];
    
    // Proses setiap event dari Google Calendar
    for (const event of events) {
      // Cek apakah event ini sudah ada di pengingat lokal
      const existingReminderIndex = localReminders.findIndex(r => r.calendarEventId === event.id);
      
      // Parse data dari event Google Calendar
      const eventData = parseGoogleCalendarEvent(event);
      
      if (eventData) {
        calendarEventIds.push(event.id);
        
        if (existingReminderIndex >= 0) {
          // Update pengingat yang sudah ada
          localReminders[existingReminderIndex] = {
            ...localReminders[existingReminderIndex],
            title: eventData.title,
            dateTime: eventData.dateTime,
            notes: eventData.notes,
            amount: eventData.amount,
            status: eventData.status
          };
        } else {
          // Tambahkan pengingat baru dari Google Calendar
          localReminders.push({
            id: 'reminder_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000),
            title: eventData.title,
            dateTime: eventData.dateTime,
            amount: eventData.amount,
            notes: eventData.notes,
            notificationMinutes: '30', // Default jika tidak bisa diambil dari Google Calendar
            status: eventData.status,
            calendarEventId: event.id
          });
        }
      }
    }
    
    // Tandai pengingat yang sudah dihapus dari Google Calendar (tapi masih ada di lokal)
    localReminders = localReminders.map(reminder => {
      if (reminder.calendarEventId && !calendarEventIds.includes(reminder.calendarEventId) && reminder.status !== 'cancelled') {
        // Event sudah dihapus dari Google Calendar, tandai sebagai cancelled
        return { ...reminder, status: 'cancelled' };
      }
      return reminder;
    });
    
    // Simpan pengingat yang sudah disinkronkan ke localStorage
    localStorage.setItem('dompetku_reminders', JSON.stringify(localReminders));
    
    // Catat waktu sinkronisasi terakhir
    localStorage.setItem('last_calendar_sync', new Date().getTime().toString());
    
    // Muat ulang tampilan pengingat
    loadReminders();
    
    console.log("Sinkronisasi dengan Google Calendar selesai");
    return true;
    
  } catch (error) {
    console.error("Error saat menyinkronkan dengan Google Calendar:", error);
    return false;
  }
}

// Fungsi untuk mengurai data dari event Google Calendar
function parseGoogleCalendarEvent(event) {
  try {
    // Pastikan event punya info yang dibutuhkan
    if (!event.summary || !event.start || !event.start.dateTime) {
      return null;
    }
    
    // Ambil judul dari summary
    const title = event.summary;
    
    // Ambil tanggal dan waktu
    const dateTime = event.start.dateTime;
    
    // Parse deskripsi untuk mendapatkan jumlah pembayaran
    let amount = 0;
    let notes = '';
    
    if (event.description) {
      // Cari pola "Pembayaran: Rp X.XXX"
      const paymentMatch = event.description.match(/Pembayaran: Rp ([0-9,.]+)/);
      if (paymentMatch && paymentMatch[1]) {
        // Hapus titik dan koma, lalu parse sebagai integer
        amount = parseInt(paymentMatch[1].replace(/[.,]/g, ''));
      }
      
      // Ambil teks setelah jumlah pembayaran sebagai catatan
      const notesMatch = event.description.split(/Pembayaran: Rp [0-9,.]+\s*\n+/);
      if (notesMatch && notesMatch.length > 1) {
        notes = notesMatch[1].trim();
      }
    }
    
    // Cek status dari deskripsi
    let status = 'pending';
    if (event.description && event.description.includes('[Status: Sudah Dibayar]')) {
      status = 'completed';
    } else if (event.description && event.description.includes('[Status: Dibatalkan]')) {
      status = 'cancelled';
    }
    
    // Cek warna event sebagai alternatif penentuan status
    if (event.colorId === '10') { // Hijau (Basil)
      status = 'completed';
    } else if (event.colorId === '11') { // Merah (Tomato)
      status = 'cancelled';
    }
    
    return {
      title,
      dateTime,
      amount: amount || 0, // Default ke 0 jika tidak bisa diparse
      notes,
      status
    };
  } catch (error) {
    console.error("Error saat parsing event Google Calendar:", error);
    return null;
  }
}

// Fungsi untuk setup sinkronisasi otomatis
function setupAutoSync() {
  // Interval sinkronisasi dalam milidetik (15 menit)
  const syncInterval = 15 * 60 * 1000;
  
  // Dapatkan timestamp sinkronisasi terakhir
  const lastSync = localStorage.getItem('last_calendar_sync');
  const now = new Date().getTime();
  
  // Cek apakah sudah waktunya sinkronisasi
  if (!lastSync || (now - parseInt(lastSync) > syncInterval)) {
    // Lakukan sinkronisasi jika user sudah login
    if (gapi.client && gapi.client.getToken()) {
      console.log("Melakukan sinkronisasi otomatis");
      syncWithGoogleCalendar();
    }
  }
  
  // Setup interval untuk sinkronisasi berkala
  setInterval(() => {
    if (gapi.client && gapi.client.getToken()) {
      console.log("Melakukan sinkronisasi berkala");
      syncWithGoogleCalendar();
    }
  }, syncInterval);
}