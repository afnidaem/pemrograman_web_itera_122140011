// walletRenderer.js - rendering dompet ke UI
import { formatRupiah, formatDate } from '/js/utils.js';

export function renderDompetCard(dompet) {
  const dompetCard = document.createElement('div');
  dompetCard.className = 'bg-white p-4 rounded-lg shadow-md border border-gray-200';
  dompetCard.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-bold text-lg text-gray-800">${dompet.nama}</h3>
      <div class="flex space-x-2">
        <button class="edit-dompet text-blue-500 hover:text-blue-700" data-id="${dompet.id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button class="delete-dompet text-red-500 hover:text-red-700" data-id="${dompet.id}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <div class="text-2xl font-bold text-blue-600">Rp ${formatRupiah(dompet.saldo)}</div>
    <div class="text-xs text-gray-500 mt-2">Dibuat pada: ${formatDate(dompet.createdAt)}</div>
  `;
  
  return dompetCard;
}

export function renderEmptyState(container) {
  container.innerHTML = `
    <div class="col-span-full text-center py-8 text-gray-500">
      Belum ada akun dompet. Silakan tambahkan akun dompet baru.
    </div>
  `;
}