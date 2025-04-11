// transactionCategories.js - daftar kategori transaksi
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense'
  };
  
  export const TRANSACTION_CATEGORIES = {
    [TRANSACTION_TYPES.INCOME]: [
      { id: 'allowance', name: 'Uang Saku' },
      { id: 'salary', name: 'Gaji' },
      { id: 'freelance', name: 'Freelance' },
      { id: 'other_income', name: 'Lain-lain' }
    ],
    [TRANSACTION_TYPES.EXPENSE]: [
      { id: 'daily_needs', name: 'Kebutuhan Sehari-hari' },
      { id: 'bills', name: 'Tagihan' },
      { id: 'health', name: 'Kesehatan' },
      { id: 'education', name: 'Pendidikan' },
      { id: 'entertainment', name: 'Hiburan' },
      { id: 'lifestyle', name: 'Gaya Hidup' },
      { id: 'emergency', name: 'Darurat' },
      { id: 'other_expense', name: 'Lain-lain' }
    ]
  };