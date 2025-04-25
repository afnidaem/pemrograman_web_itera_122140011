# Menggunakan modul bawaan Python
import math
import random
import datetime
import os

# Menggunakan math module
print("Modul math:")
print(f"Nilai Pi: {math.pi}")
print(f"Akar kuadrat dari 16: {math.sqrt(16)}")
print(f"Cos(0): {math.cos(0)}\n")

# Menggunakan random module
print("Modul random:")
print(f"Angka acak antara 1 dan 10: {random.randint(1, 10)}")
print(f"Pilihan acak dari list: {random.choice(['apel', 'jeruk', 'mangga'])}\n")

# Menggunakan datetime module
print("Modul datetime:")
today = datetime.datetime.now()
print(f"Tanggal dan waktu saat ini: {today}")
print(f"Hanya tanggal: {today.date()}")
print(f"Hanya waktu: {today.time()}\n")

# Menggunakan os module
print("Modul os:")
print(f"Direktori saat ini: {os.getcwd()}")
print(f"List file dalam direktori: {os.listdir()[:5]}")  # Menampilkan 5 item pertama