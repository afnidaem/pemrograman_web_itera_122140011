# Program Pengelolaan Data Nilai Mahasiswa

# Membuat list data mahasiswa
dataMhs = [
    {
        "nama": "Baskara Putra",
        "nim": "2025124",
        "nilai_uts": 85,
        "nilai_uas": 78,
        "nilai_tugas": 90
    },
    {
        "nama": "Meidiana Thahir",
        "nim": "2023002",
        "nilai_uts": 65,
        "nilai_uas": 70,
        "nilai_tugas": 75
    },
    {
        "nama": "Anggra",
        "nim": "2023003",
        "nilai_uts": 90,
        "nilai_uas": 92,
        "nilai_tugas": 88
    },
    {
        "nama": "Alexandra",
        "nim": "2023004",
        "nilai_uts": 55,
        "nilai_uas": 60,
        "nilai_tugas": 70
    },
    {
        "nama": "Hiranya Jayastu",
        "nim": "2023005",
        "nilai_uts": 45,
        "nilai_uas": 50,
        "nilai_tugas": 60
    }
]

# Fungsi untuk menghitung nilai akhir
def hitung_nilai_akhir(uts, uas, tugas):
    return (0.3 * uts) + (0.4 * uas) + (0.3 * tugas)

# Fungsi untuk menentukan grade berdasarkan nilai akhir
def tentukan_grade(nilai_akhir):
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"

# Menghitung nilai akhir dan menentukan grade untuk setiap mahasiswa
for mhs in dataMhs:
    na = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
    mhs["nilai_akhir"] = round(na, 2)  # Pembulatan 2 angka di belakang koma
    mhs["grade"] = tentukan_grade(na)

# Fungsi untuk mencetak tabel data mahasiswa
def cetak_tabel_mahasiswa(data_mahasiswa):
    # Header tabel
    print("=" * 90)
    print("| {:<4} | {:<15} | {:<10} | {:<8} | {:<8} | {:<8} | {:<11} | {:<5} |".format(
        "No", "Nama", "NIM", "UTS", "UAS", "Tugas", "Nilai Akhir", "Grade"))
    print("=" * 90)
    
    # Isi tabel
    for i, mhs in enumerate(data_mahasiswa, 1):
        print("| {:<4} | {:<15} | {:<10} | {:<8} | {:<8} | {:<8} | {:<11} | {:<5} |".format(
            i,
            mhs["nama"],
            mhs["nim"],
            mhs["nilai_uts"],
            mhs["nilai_uas"],
            mhs["nilai_tugas"],
            mhs["nilai_akhir"],
            mhs["grade"]
        ))
    
    print("=" * 90)

# Menampilkan data mahasiswa dalam bentuk tabel
print("\nDATA NILAI MAHASISWA")
cetak_tabel_mahasiswa(dataMhs)

# Mencari mahasiswa dengan nilai tertinggi dan terendah
nilai_tertinggi = max(dataMhs, key=lambda x: x["nilai_akhir"])
nilai_terendah = min(dataMhs, key=lambda x: x["nilai_akhir"])

# Menampilkan mahasiswa dengan nilai tertinggi dan terendah
print("\nMahasiswa dengan nilai tertinggi:")
print(f"Nama: {nilai_tertinggi['nama']}")
print(f"NIM: {nilai_tertinggi['nim']}")
print(f"Nilai Akhir: {nilai_tertinggi['nilai_akhir']}")
print(f"Grade: {nilai_tertinggi['grade']}")

print("\nMahasiswa dengan nilai terendah:")
print(f"Nama: {nilai_terendah['nama']}")
print(f"NIM: {nilai_terendah['nim']}")
print(f"Nilai Akhir: {nilai_terendah['nilai_akhir']}")
print(f"Grade: {nilai_terendah['grade']}")