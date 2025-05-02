# Membuat class Mahasiswa
class Mahasiswa:
    # Atribut Class (shared by all instances)
    jurusan = "Teknik Informatika"
    
    # Constructor/initializer
    def __init__(self, nama, nim):
        # Atribut Instance (unique for each instance)
        self.nama = nama
        self.nim = nim
        
    # Method
    def display_info(self):
        print(f"Nama: {self.nama}")
        print(f"NIM: {self.nim}")
        print(f"Jurusan: {self.jurusan}")
        
    def update_nama(self, nama_baru):
        self.nama = nama_baru
        print(f"Nama berhasil diubah menjadi {nama_baru}")

# Membuat object (instance) dari class Mahasiswa
mhs1 = Mahasiswa("Budi Santoso", "TI12345")
mhs2 = Mahasiswa("Ani Wijaya", "TI67890")

# Mengakses atribut
print(f"Mahasiswa 1: {mhs1.nama}, NIM: {mhs1.nim}")
print(f"Mahasiswa 2: {mhs2.nama}, NIM: {mhs2.nim}")

# Memanggil method
print("\nInformasi Mahasiswa 1:")
mhs1.display_info()

print("\nInformasi Mahasiswa 2:")
mhs2.display_info()

# Mengubah atribut
mhs1.update_nama("Budi Prakoso")

# Mengubah class attribute (berlaku untuk semua instance)
Mahasiswa.jurusan = "Informatika"
print("\nSetelah perubahan jurusan:")
mhs1.display_info()
mhs2.display_info()