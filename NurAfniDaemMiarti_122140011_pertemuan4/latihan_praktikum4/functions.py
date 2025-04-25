# Fungsi dasar
def sapa():
    print("Halo, selamat datang!")

# Memanggil fungsi
print("Memanggil fungsi sapa():")
sapa()

# Fungsi dengan parameter
def sapa_nama(nama):
    print(f"Halo, {nama}! Selamat datang!")

print("\nFungsi dengan parameter:")
sapa_nama("Budi")
sapa_nama("Ani")

# Fungsi dengan parameter default
def sapa_lengkap(nama, pesan="Selamat datang!"):
    print(f"Halo, {nama}! {pesan}")

print("\nFungsi dengan parameter default:")
sapa_lengkap("Citra")
sapa_lengkap("Dodi", "Semoga harimu menyenangkan!")

# Fungsi dengan return value
def jumlah(a, b):
    return a + b

print("\nFungsi dengan return value:")
hasil = jumlah(5, 3)
print(f"5 + 3 = {hasil}")

# Fungsi dengan multiple return values
def operasi_aritmatika(a, b):
    tambah = a + b
    kurang = a - b
    kali = a * b
    bagi = a / b
    return tambah, kurang, kali, bagi

print("\nFungsi dengan multiple return values:")
a, b, c, d = operasi_aritmatika(10, 2)
print(f"10 + 2 = {a}")
print(f"10 - 2 = {b}")
print(f"10 * 2 = {c}")
print(f"10 / 2 = {d}")

# Lambda function (anonymous function)
print("\nLambda function:")
kuadrat = lambda x: x**2
print(f"Kuadrat dari 5 adalah {kuadrat(5)}")

# Menggunakan lambda dengan built-in functions
angka = [1, 5, 4, 3, 2, 6]
angka_urut = sorted(angka)
print(f"Sorted: {angka_urut}")

# Menggunakan fungsi sebagai argumen
def apply_operation(a, b, operation):
    return operation(a, b)

print("\nFungsi sebagai argumen:")
add = lambda x, y: x + y
multiply = lambda x, y: x * y

print(f"5 + 3 = {apply_operation(5, 3, add)}")
print(f"5 * 3 = {apply_operation(5, 3, multiply)}")