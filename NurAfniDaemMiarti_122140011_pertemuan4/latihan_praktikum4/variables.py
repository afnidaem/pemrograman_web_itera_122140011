# Variabel dan tipe data dasar
nama = "Budi Santoso"    # string
usia = 20                # integer
tinggi = 175.5           # float
is_mahasiswa = True      # boolean

# Menampilkan nilai variabel
print("Nama:", nama)
print("Usia:", usia, "tahun")
print("Tinggi:", tinggi, "cm")
print("Status mahasiswa:", is_mahasiswa)

# Memeriksa tipe data
print("\nTipe data variabel:")
print("Tipe data nama:", type(nama))
print("Tipe data usia:", type(usia))
print("Tipe data tinggi:", type(tinggi))
print("Tipe data is_mahasiswa:", type(is_mahasiswa))

# Konversi tipe data
usia_str = str(usia)
print("\nUsia (string):", usia_str)
print("Tipe data usia_str:", type(usia_str))

# Input dari user
print("\nInput dari pengguna:")
nama_input = input("Masukkan nama Anda: ")
usia_input = int(input("Masukkan usia Anda: "))  # konversi input ke integer
print(f"Halo {nama_input}, usia Anda {usia_input} tahun")