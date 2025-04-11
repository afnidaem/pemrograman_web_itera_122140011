// Konfigurasi API Google Calendar
const CLIENT_ID = '1089824538886-n7teishjfj9hrmfpb8edq9kfi7l73fsm.apps.googleusercontent.com'; // Gantilah dengan Client ID dari Google Cloud Console Anda
const API_KEY = 'AIzaSyCaAI7JvDLbXoIwUld3bW8npmCfKizim58'; // Gantilah dengan API Key dari Google Cloud Console Anda
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

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

// Inisialisasi API Google Calendar
document.addEventListener('DOMContentLoaded', initializeGoogleAPI);

function initializeGoogleAPI() {
  gapiLoaded();
  gisLoaded();
  
  // Cek status login Google
  checkAuthStatus();
  
  // Tampilkan pesan kosong jika belum ada pengingat
  checkEmptyReminders();
  
  // Event listeners
  btnCreateReminder.addEventListener('click', toggleReminderForm);
  btnCancelReminder.addEventListener('click', toggleReminderForm);
  formCreateReminder.addEventListener('submit', handleCreateReminder);
}

// Inisialisasi Google API Client
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Inisialisasi Google Identity Services
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Akan didefinisikan kemudian
  });
  gisInited = true;
  maybeEnableButtons();
}

// Aktifkan tombol jika API sudah siap
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    btnAuthorize.classList.remove('hidden');
    btnAuthorize.addEventListener('click', handleAuthClick);
    btnSignout.addEventListener('click', handleSignoutClick);
    
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
  btnAuthorize.classList.add('hidden');
  btnSignout.classList.remove('hidden');
  googleApiStatus.classList.add('hidden');
  btnCreateReminder.disabled = false;
  
  // Load pengingat dari localStorage
  loadReminders();
}

// Handler untuk tampilan saat user belum login
function handleNotSignedIn() {
  btnAuthorize.classList.remove('hidden');
  btnSignout.classList.add('hidden');
  googleApiStatus.classList.remove('hidden');
  btnCreateReminder.disabled = true;
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

// Toggle form pengingat
function toggleReminderForm() {
  if (reminderFormContainer.classList.contains('hidden')) {
    reminderFormContainer.classList.remove('hidden');
  } else {
    reminderFormContainer.classList.add('hidden');
    formCreateReminder.reset();
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
      'description': `Pembayaran: Rp ${amount.toLocaleString('id-ID')}\n\n${notes}`,
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
    formCreateReminder.reset();
    toggleReminderForm();
    
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
    if (reminder.calendarEventId) {
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
function updateReminderStatus(reminderId, newStatus) {
  let reminders = JSON.parse(localStorage.getItem('dompetku_reminders')) || [];
  const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);
  
  if (reminderIndex !== -1) {
    // Update status
    reminders[reminderIndex].status = newStatus;
    localStorage.setItem('dompetku_reminders', JSON.stringify(reminders));
    
    // Update tampilan
    const reminderElement = document.getElementById(reminderId);
    if (reminderElement) {
      // Hapus class status lama
      reminderElement.classList.remove('border-yellow-300', 'border-green-300', 'border-red-300');
      
      // Tambahkan class status baru
      if (newStatus === 'pending') {
        reminderElement.classList.add('border-yellow-300');
      } else if (newStatus === 'completed') {
        reminderElement.classList.add('border-green-300');
      } else if (newStatus === 'cancelled') {
        reminderElement.classList.add('border-red-300');
      }
      
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
  
  statusDropdownBtn.addEventListener('click', () => {
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