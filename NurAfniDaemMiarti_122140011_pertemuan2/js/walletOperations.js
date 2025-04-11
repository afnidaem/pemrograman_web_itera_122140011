// walletOperations.js - operasi-operasi pada dompet
import { getDompetsFromStorage, saveDompetsToStorage } from '/js/walletStorage.js';
import { generateId } from '/js/utils.js';

export function createDompet(nama, saldo) {
  const dompets = getDompetsFromStorage();
  
  const newDompet = {
    id: generateId(),
    nama: nama,
    saldo: saldo,
    createdAt: new Date().toISOString()
  };
  
  dompets.push(newDompet);
  saveDompetsToStorage(dompets);
  
  return newDompet;
}

export function updateDompet(id, updatedData) {
  const dompets = getDompetsFromStorage();
  const index = dompets.findIndex(d => d.id === id);
  
  if (index !== -1) {
    dompets[index] = { ...dompets[index], ...updatedData };
    saveDompetsToStorage(dompets);
    return dompets[index];
  }
  
  return null;
}

export function deleteDompet(id) {
  const dompets = getDompetsFromStorage();
  const updatedDompets = dompets.filter(d => d.id !== id);
  
  saveDompetsToStorage(updatedDompets);
  return updatedDompets;
}

export function getAllDompets() {
  return getDompetsFromStorage();
}

export function getDompetById(id) {
  const dompets = getDompetsFromStorage();
  return dompets.find(d => d.id === id);
}