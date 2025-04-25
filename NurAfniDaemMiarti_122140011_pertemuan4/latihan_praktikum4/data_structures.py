# List - koleksi data yang terurut dan bisa diubah
print("LIST OPERATIONS")
print("--------------")

# Membuat list
buah = ["Apel", "Jeruk", "Mangga", "Pisang"]
print("List buah:", buah)

# Mengakses elemen list
print("\nMengakses elemen list:")
print("Buah pertama:", buah[0])
print("Buah terakhir:", buah[-1])  # Indeks negatif menghitung dari belakang

# Slicing list
print("\nSlicing list:")
print("Dua buah pertama:", buah[0:2])  # Indeks 0 dan 1
print("Dua buah terakhir:", buah[-2:])  # Dua terakhir

# Mengubah elemen list
print("\nMengubah elemen list:")
buah[1] = "Strawberry"
print("Setelah mengubah buah[1]:", buah)

# Metode list
print("\nMetode list:")

# Menambah elemen
buah.append("Anggur")
print("Setelah append Anggur:", buah)

buah.insert(2, "Durian")
print("Setelah insert Durian di indeks 2:", buah)

# Menghapus elemen
removed = buah.pop()
print(f"Elemen yang dihapus dengan pop(): {removed}")
print("List setelah pop():", buah)

buah.remove("Durian")
print("List setelah remove('Durian'):", buah)

# List operations
print("\nList operations:")
print("Jumlah elemen:", len(buah))
print("Apel di indeks:", buah.index("Apel"))

# Sorting list
angka = [3, 1, 4, 1, 5, 9, 2]
print("\nList angka:", angka)

angka.sort()
print("Setelah sort():", angka)

angka.reverse()
print("Setelah reverse():", angka)

# Nested list
print("\nNested list:")
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print("Matrix:", matrix)
print("matrix[1][2]:", matrix[1][2])  # Mengakses elemen baris 1, kolom 2 (nilai 6)

# Dictionary - koleksi key-value yang tidak berurutan
print("\n\nDICTIONARY OPERATIONS")
print("--------------------")

# Membuat dictionary
mahasiswa = {
    "nama": "Budi Santoso",
    "nim": "20210001",
    "jurusan": "Teknik Informatika",
    "usia": 20
}
print("Dictionary mahasiswa:", mahasiswa)

# Mengakses nilai dengan key
print("\nMengakses nilai dengan key:")
print("Nama:", mahasiswa["nama"])
print("NIM:", mahasiswa["nim"])

# Mengakses dengan get() (lebih aman)
print("\nMengakses dengan get():")
print("Jurusan:", mahasiswa.get("jurusan"))
print("IPK:", mahasiswa.get("ipk", "Data tidak tersedia"))  # Default jika key tidak ada

# Mengubah nilai
print("\nMengubah nilai:")
mahasiswa["usia"] = 21
print("Setelah mengubah usia:", mahasiswa)

# Menambah pasangan key-value baru
mahasiswa["ipk"] = 3.75
print("Setelah menambah IPK:", mahasiswa)

# Menghapus item
print("\nMenghapus item:")
del mahasiswa["usia"]
print("Setelah menghapus usia:", mahasiswa)

# Dictionary methods
print("\nDictionary methods:")
print("Keys:", list(mahasiswa.keys()))
print("Values:", list(mahasiswa.values()))
print("Items:", list(mahasiswa.items()))

# Looping dictionary
print("\nLooping dictionary:")
for key in mahasiswa:
    print(f"{key}: {mahasiswa[key]}")

print("\nLooping items:")
for key, value in mahasiswa.items():
    print(f"{key}: {value}")

# Nested dictionary
print("\nNested dictionary:")
kampus = {
    "fakultas": {
        "FTIK": ["Informatika", "Sistem Informasi"],
        "FTI": ["Teknik Elektro", "Teknik Mesin"]
    },
    "alamat": "Jl. Pendidikan No. 1"
}
print("Kampus:", kampus)
print("Prodi di FTIK:", kampus["fakultas"]["FTIK"])