// walletStorage.js - pengaturan penyimpanan dompet
  export function getDompetsFromStorage() {
    const dompetsJSON = localStorage.getItem('dompets');
    return dompetsJSON ? JSON.parse(dompetsJSON) : [];
  }
  
  export function saveDompetsToStorage(dompets) {
    localStorage.setItem('dompets', JSON.stringify(dompets));
  }