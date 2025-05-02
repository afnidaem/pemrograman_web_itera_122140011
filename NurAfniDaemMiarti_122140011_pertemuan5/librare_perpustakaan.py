from abc import ABC, abstractmethod
from datetime import datetime

class LibraryItem(ABC):
    """
    Kelas abstrak dasar untuk semua item perpustakaan.
    Mengimplementasikan atribut dan metode umum untuk item perpustakaan.
    """
    def __init__(self, item_id, judul, tahun_terbit):
        self._item_id = item_id  # Atribut protected
        self._judul = judul  # Atribut protected
        self._tahun_terbit = tahun_terbit  # Atribut protected
        self._tersedia = True  # Atribut protected
        self._tanggal_peminjaman = None  # Atribut protected
        
    @property
    def item_id(self):
        """Property getter untuk item_id"""
        return self._item_id
    
    @property
    def judul(self):
        """Property getter untuk judul"""
        return self._judul
    
    @property
    def tersedia(self):
        """Property getter untuk status ketersediaan"""
        return self._tersedia
    
    @property
    def tahun_terbit(self):
        """Property getter untuk tahun terbit"""
        return self._tahun_terbit
    
    def pinjam(self):
        """Meminjam item jika tersedia"""
        if self._tersedia:
            self._tersedia = False
            self._tanggal_peminjaman = datetime.now()
            return True
        return False
    
    def kembalikan(self):
        """Mengembalikan item ke perpustakaan"""
        self._tersedia = True
        self._tanggal_peminjaman = None
        return True
    
    @abstractmethod
    def tampilkan_info(self):
        """
        Metode abstrak yang harus diimplementasikan oleh subclass.
        Menampilkan informasi tentang item perpustakaan.
        """
        pass
    
    @abstractmethod
    def get_masa_pinjam(self):
        """
        Metode abstrak yang harus diimplementasikan oleh subclass.
        Mengembalikan masa pinjam dalam hari untuk jenis item ini.
        """
        pass


class Buku(LibraryItem):
    """
    Kelas Buku yang mewarisi dari LibraryItem.
    Merepresentasikan sebuah buku di perpustakaan.
    """
    def __init__(self, item_id, judul, tahun_terbit, penulis, isbn, jumlah_halaman):
        super().__init__(item_id, judul, tahun_terbit)
        self._penulis = penulis  # Atribut protected
        self._isbn = isbn  # Atribut protected
        self.__jumlah_halaman = jumlah_halaman  # Atribut private
    
    @property
    def penulis(self):
        """Property getter untuk penulis"""
        return self._penulis
    
    @property
    def isbn(self):
        """Property getter untuk ISBN"""
        return self._isbn
    
    @property
    def jumlah_halaman(self):
        """Property getter untuk jumlah halaman"""
        return self.__jumlah_halaman
    
    @jumlah_halaman.setter
    def jumlah_halaman(self, nilai):
        """Property setter untuk jumlah halaman dengan validasi"""
        if isinstance(nilai, int) and nilai > 0:
            self.__jumlah_halaman = nilai
        else:
            raise ValueError("Jumlah halaman harus berupa bilangan bulat positif")
    
    def tampilkan_info(self):
        """Implementasi metode abstrak untuk menampilkan informasi buku"""
        status = "Tersedia" if self._tersedia else "Sedang Dipinjam"
        return (f"ID Buku: {self._item_id}\n"
                f"Judul: {self._judul}\n"
                f"Penulis: {self._penulis}\n"
                f"Tahun: {self._tahun_terbit}\n"
                f"ISBN: {self._isbn}\n"
                f"Halaman: {self.__jumlah_halaman}\n"
                f"Status: {status}")
    
    def get_masa_pinjam(self):
        """Implementasi metode abstrak untuk mengembalikan masa pinjam dalam hari"""
        return 21  # Buku dapat dipinjam selama 21 hari


class Majalah(LibraryItem):
    """
    Kelas Majalah yang mewarisi dari LibraryItem.
    Merepresentasikan sebuah majalah di perpustakaan.
    """
    def __init__(self, item_id, judul, tahun_terbit, nomor_edisi, penerbit):
        super().__init__(item_id, judul, tahun_terbit)
        self._nomor_edisi = nomor_edisi  # Atribut protected
        self._penerbit = penerbit  # Atribut protected
    
    @property
    def nomor_edisi(self):
        """Property getter untuk nomor edisi"""
        return self._nomor_edisi
    
    @property
    def penerbit(self):
        """Property getter untuk penerbit"""
        return self._penerbit
    
    def tampilkan_info(self):
        """Implementasi metode abstrak untuk menampilkan informasi majalah"""
        status = "Tersedia" if self._tersedia else "Sedang Dipinjam"
        return (f"ID Majalah: {self._item_id}\n"
                f"Judul: {self._judul}\n"
                f"Tahun: {self._tahun_terbit}\n"
                f"Edisi: {self._nomor_edisi}\n"
                f"Penerbit: {self._penerbit}\n"
                f"Status: {status}")
    
    def get_masa_pinjam(self):
        """Implementasi metode abstrak untuk mengembalikan masa pinjam dalam hari"""
        return 7  # Majalah dapat dipinjam selama 7 hari


class Perpustakaan:
    """
    Kelas Perpustakaan untuk mengelola koleksi item perpustakaan.
    """
    def __init__(self, nama):
        self.__nama = nama  # Atribut private
        self.__items = {}  # Atribut private: kamus untuk menyimpan item perpustakaan
    
    @property
    def nama(self):
        """Property getter untuk nama perpustakaan"""
        return self.__nama
    
    @property
    def items(self):
        """Property getter untuk items (mengembalikan salinan dari kamus items)"""
        return self.__items.copy()
    
    def tambah_item(self, item):
        """Menambahkan item baru ke perpustakaan"""
        if not isinstance(item, LibraryItem):
            raise TypeError("Item harus merupakan instance dari LibraryItem")
        
        if item.item_id in self.__items:
            return False  # ID item sudah ada
        
        self.__items[item.item_id] = item
        return True
    
    def hapus_item(self, item_id):
        """Menghapus item dari perpustakaan berdasarkan ID-nya"""
        if item_id in self.__items:
            del self.__items[item_id]
            return True
        return False
    
    def cari_item_by_id(self, item_id):
        """Mencari item berdasarkan ID"""
        return self.__items.get(item_id)
    
    def cari_items_by_judul(self, judul):
        """Mencari item berdasarkan judul (tidak case-sensitive, pencarian parsial)"""
        judul = judul.lower()
        return [item for item in self.__items.values() 
                if judul in item.judul.lower()]
    
    def get_item_tersedia(self):
        """Mendapatkan semua item yang tersedia"""
        return [item for item in self.__items.values() if item.tersedia]
    
    def pinjam_item(self, item_id):
        """Meminjam item berdasarkan ID-nya"""
        item = self.cari_item_by_id(item_id)
        if item and item.tersedia:
            return item.pinjam()
        return False
    
    def kembalikan_item(self, item_id):
        """Mengembalikan item berdasarkan ID-nya"""
        item = self.cari_item_by_id(item_id)
        if item and not item.tersedia:
            return item.kembalikan()
        return False
    
    def tampilkan_semua_item(self):
        """Menampilkan informasi tentang semua item di perpustakaan"""
        if not self.__items:
            return "Perpustakaan kosong."
        
        hasil = f"Item di Perpustakaan {self.__nama}:\n"
        hasil += "=" * 40 + "\n"
        
        for item in self.__items.values():
            hasil += item.tampilkan_info() + "\n"
            hasil += "-" * 40 + "\n"
        
        return hasil


# Program utama dengan interaksi pengguna
if __name__ == "__main__":
    # Membuat perpustakaan dengan nama tetap "Librare"
    perpustakaan = Perpustakaan("Librare")
    
    while True:
        print("\n===== SISTEM MANAJEMEN PERPUSTAKAAN Librare =====")
        print("1. Tambah Buku")
        print("2. Tambah Majalah")
        print("3. Cari Item berdasarkan ID")
        print("4. Cari Item berdasarkan Judul")
        print("5. Tampilkan Semua Item")
        print("6. Pinjam Item")
        print("7. Kembalikan Item")
        print("8. Tampilkan Item Tersedia")
        print("0. Keluar")
        
        pilihan = input("\nPilih menu (0-8): ")
        
        if pilihan == "1":
            print("\n----- TAMBAH BUKU -----")
            item_id = input("Masukkan ID Buku (contoh: B001): ")
            judul = input("Masukkan Judul Buku: ")
            
            # Validasi tahun terbit
            while True:
                try:
                    tahun_terbit = int(input("Masukkan Tahun Terbit: "))
                    break
                except ValueError:
                    print("Error: Tahun terbit harus berupa angka!")
            
            penulis = input("Masukkan Nama Penulis: ")
            isbn = input("Masukkan ISBN: ")
            
            # Validasi jumlah halaman
            while True:
                try:
                    jumlah_halaman = int(input("Masukkan Jumlah Halaman: "))
                    if jumlah_halaman <= 0:
                        print("Error: Jumlah halaman harus lebih dari 0!")
                    else:
                        break
                except ValueError:
                    print("Error: Jumlah halaman harus berupa angka!")
            
            buku = Buku(item_id, judul, tahun_terbit, penulis, isbn, jumlah_halaman)
            
            if perpustakaan.tambah_item(buku):
                print(f"Buku '{judul}' berhasil ditambahkan ke perpustakaan.")
            else:
                print(f"Gagal menambahkan buku. ID '{item_id}' sudah digunakan.")
        
        elif pilihan == "2":
            print("\n----- TAMBAH MAJALAH -----")
            item_id = input("Masukkan ID Majalah (contoh: M001): ")
            judul = input("Masukkan Judul Majalah: ")
            
            # Validasi tahun terbit
            while True:
                try:
                    tahun_terbit = int(input("Masukkan Tahun Terbit: "))
                    break
                except ValueError:
                    print("Error: Tahun terbit harus berupa angka!")
            
            nomor_edisi = input("Masukkan Nomor Edisi: ")
            penerbit = input("Masukkan Nama Penerbit: ")
            
            majalah = Majalah(item_id, judul, tahun_terbit, nomor_edisi, penerbit)
            
            if perpustakaan.tambah_item(majalah):
                print(f"Majalah '{judul}' berhasil ditambahkan ke perpustakaan.")
            else:
                print(f"Gagal menambahkan majalah. ID '{item_id}' sudah digunakan.")
        
        elif pilihan == "3":
            print("\n----- CARI ITEM BERDASARKAN ID -----")
            item_id = input("Masukkan ID Item yang ingin dicari: ")
            item = perpustakaan.cari_item_by_id(item_id)
            
            if item:
                print("\nItem ditemukan:")
                print(item.tampilkan_info())
            else:
                print(f"Item dengan ID '{item_id}' tidak ditemukan.")
        
        elif pilihan == "4":
            print("\n----- CARI ITEM BERDASARKAN JUDUL -----")
            judul = input("Masukkan Judul Item yang ingin dicari: ")
            hasil_pencarian = perpustakaan.cari_items_by_judul(judul)
            
            if hasil_pencarian:
                print(f"\nDitemukan {len(hasil_pencarian)} item:")
                for item in hasil_pencarian:
                    print(item.tampilkan_info())
                    print("-" * 40)
            else:
                print(f"Tidak ditemukan item dengan judul yang mengandung '{judul}'.")
        
        elif pilihan == "5":
            print("\n----- DAFTAR SEMUA ITEM -----")
            daftar_item = perpustakaan.tampilkan_semua_item()
            print(daftar_item)
        
        elif pilihan == "6":
            print("\n----- PINJAM ITEM -----")
            item_id = input("Masukkan ID Item yang ingin dipinjam: ")
            
            if perpustakaan.pinjam_item(item_id):
                print("Item berhasil dipinjam.")
            else:
                item = perpustakaan.cari_item_by_id(item_id)
                if item and not item.tersedia:
                    print("Item ini sudah dipinjam.")
                else:
                    print(f"Item dengan ID '{item_id}' tidak ditemukan.")
        
        elif pilihan == "7":
            print("\n----- KEMBALIKAN ITEM -----")
            item_id = input("Masukkan ID Item yang ingin dikembalikan: ")
            
            if perpustakaan.kembalikan_item(item_id):
                print("Item berhasil dikembalikan.")
            else:
                item = perpustakaan.cari_item_by_id(item_id)
                if item and item.tersedia:
                    print("Item ini tidak sedang dipinjam.")
                else:
                    print(f"Item dengan ID '{item_id}' tidak ditemukan.")
        
        elif pilihan == "8":
            print("\n----- ITEM TERSEDIA -----")
            item_tersedia = perpustakaan.get_item_tersedia()
            
            if item_tersedia:
                print(f"Jumlah item tersedia: {len(item_tersedia)}")
                for item in item_tersedia:
                    print(f"- [{item.item_id}] {item.judul}")
            else:
                print("Tidak ada item tersedia saat ini.")
        
        elif pilihan == "0":
            print("Terima kasih telah menggunakan Sistem Manajemen Perpustakaan.")
            break
        
        else:
            print("Pilihan tidak valid. Silakan pilih menu 0-8.")
