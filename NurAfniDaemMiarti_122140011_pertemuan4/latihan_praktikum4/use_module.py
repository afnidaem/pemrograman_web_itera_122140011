# Mengimpor modul yang telah kita buat
import my_module

# Menggunakan variabel dari modul
print(f"Nilai Pi: {my_module.pi}")

# Menggunakan fungsi dari modul
radius = 5
luas = my_module.hitung_luas_lingkaran(radius)
keliling = my_module.hitung_keliling_lingkaran(radius)

print(f"Lingkaran dengan radius {radius}")
print(f"Luas: {luas:.2f}")
print(f"Keliling: {keliling:.2f}")

# Mengimpor fungsi tertentu dari modul
from my_module import celsius_ke_fahrenheit, fahrenheit_ke_celsius

# Menggunakan fungsi yang diimpor
celsius = 25
fahrenheit = celsius_ke_fahrenheit(celsius)
print(f"\n{celsius}°C = {fahrenheit:.2f}°F")

fahrenheit = 98.6
celsius = fahrenheit_ke_celsius(fahrenheit)
print(f"{fahrenheit}°F = {celsius:.2f}°C")

# Mengimpor semua dari modul (umumnya tidak disarankan)
# from my_module import *

# Mengimpor modul dengan alias
import my_module as mm
print(f"\nMenggunakan alias: Pi = {mm.pi}")