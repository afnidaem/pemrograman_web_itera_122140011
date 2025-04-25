# Cara pertama: Import modul secara keseluruhan
import math_operations

# Cara kedua: Import fungsi-fungsi tertentu dari modul
from math_operations import (
    celsius_ke_fahrenheit, 
    celsius_ke_kelvin,
    fahrenheit_ke_celsius,
    kelvin_ke_celsius,
    PI
)

def garis_pemisah(char="-", panjang=50):
    """Membuat garis pemisah"""
    print(char * panjang)

def header(judul):
    """Membuat header untuk output"""
    garis_pemisah("=")
    print(f"{judul.center(50)}")
    garis_pemisah("=")

def menu_utama():
    """Menampilkan menu utama"""
    header("PROGRAM OPERASI MATEMATIKA")
    print("1. Hitung Luas dan Keliling Bentuk Geometri")
    print("2. Konversi Suhu")
    print("0. Keluar")
    garis_pemisah()
    
    pilihan = input("Pilih menu (0-2): ")
    return pilihan

def menu_geometri():
    """Menampilkan menu bentuk geometri"""
    header("MENU BENTUK GEOMETRI")
    print("1. Persegi")
    print("2. Persegi Panjang")
    print("3. Lingkaran")
    print("0. Kembali ke Menu Utama")
    garis_pemisah()
    
    pilihan = input("Pilih bentuk geometri (0-3): ")
    return pilihan

def menu_konversi_suhu():
    """Menampilkan menu konversi suhu"""
    header("MENU KONVERSI SUHU")
    print("1. Celsius ke Fahrenheit")
    print("2. Celsius ke Kelvin")
    print("3. Fahrenheit ke Celsius")
    print("4. Kelvin ke Celsius")
    print("0. Kembali ke Menu Utama")
    garis_pemisah()
    
    pilihan = input("Pilih konversi suhu (0-4): ")
    return pilihan

def hitung_persegi():
    """Menghitung luas dan keliling persegi"""
    header("HITUNG PERSEGI")
    
    try:
        sisi = float(input("Masukkan panjang sisi (dalam cm): "))
        if sisi <= 0:
            print("Error: Sisi harus lebih besar dari 0!")
            return
        
        luas = math_operations.luas_persegi(sisi)
        keliling = math_operations.keliling_persegi(sisi)
        
        print(f"\nHasil perhitungan untuk persegi dengan sisi {sisi}:")
        print(f"Luas     = {luas} cm²")
        print(f"Keliling = {keliling} cm")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def hitung_persegi_panjang():
    """Menghitung luas dan keliling persegi panjang"""
    header("HITUNG PERSEGI PANJANG")
    
    try:
        panjang = float(input("Masukkan panjang (dalam cm): "))
        lebar = float(input("Masukkan lebar (dalam cm): "))
        
        if panjang <= 0 or lebar <= 0:
            print("Error: Panjang dan lebar harus lebih besar dari 0!")
            return
        
        luas = math_operations.luas_persegi_panjang(panjang, lebar)
        keliling = math_operations.keliling_persegi_panjang(panjang, lebar)
        
        print(f"\nHasil perhitungan untuk persegi panjang dengan panjang {panjang} dan lebar {lebar}:")
        print(f"Luas     = {luas} cm²")
        print(f"Keliling = {keliling} cm")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def hitung_lingkaran():
    """Menghitung luas dan keliling lingkaran"""
    header("HITUNG LINGKARAN")
    
    try:
        pilihan = input("Hitung berdasarkan (1. Jari-jari / 2. Diameter): ")
        
        if pilihan == "1":
            jari_jari = float(input("Masukkan jari-jari (dalam cm): "))
            if jari_jari <= 0:
                print("Error: Jari-jari harus lebih besar dari 0!")
                return
        elif pilihan == "2":
            diameter = float(input("Masukkan diameter: "))
            if diameter <= 0:
                print("Error: Diameter harus lebih besar dari 0!")
                return
            jari_jari = diameter / 2
        else:
            print("Pilihan tidak valid!")
            return
        
        luas = math_operations.luas_lingkaran(jari_jari)
        keliling = math_operations.keliling_lingkaran(jari_jari)
        
        print(f"\nHasil perhitungan untuk lingkaran dengan jari-jari {jari_jari}:")
        print(f"Luas     = {luas:.4f} cm² (dengan PI = {PI})")
        print(f"Keliling = {keliling:.4f} cm")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def konversi_cel_to_fah():
    """Mengkonversi Celsius ke Fahrenheit"""
    header("CELSIUS KE FAHRENHEIT")
    
    try:
        celsius = float(input("Masukkan suhu dalam Celsius: "))
        fahrenheit = celsius_ke_fahrenheit(celsius)
        
        print(f"\n{celsius}°C = {fahrenheit:.2f}°F")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def konversi_cel_to_kel():
    """Mengkonversi Celsius ke Kelvin"""
    header("CELSIUS KE KELVIN")
    
    try:
        celsius = float(input("Masukkan suhu dalam Celsius: "))
        kelvin = celsius_ke_kelvin(celsius)
        
        print(f"\n{celsius}°C = {kelvin:.2f}K")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def konversi_fah_to_cel():
    """Mengkonversi Fahrenheit ke Celsius"""
    header("FAHRENHEIT KE CELSIUS")
    
    try:
        fahrenheit = float(input("Masukkan suhu dalam Fahrenheit: "))
        celsius = fahrenheit_ke_celsius(fahrenheit)
        
        print(f"\n{fahrenheit}°F = {celsius:.2f}°C")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

def konversi_kel_to_cel():
    """Mengkonversi Kelvin ke Celsius"""
    header("KELVIN KE CELSIUS")
    
    try:
        kelvin = float(input("Masukkan suhu dalam Kelvin: "))
        if kelvin < 0:
            print("Error: Suhu Kelvin tidak boleh di bawah 0!")
            return
            
        celsius = kelvin_ke_celsius(kelvin)
        
        print(f"\n{kelvin}K = {celsius:.2f}°C")
    except ValueError:
        print("Error: Masukkan angka yang valid!")

# Program utama
def main():
    while True:
        pilihan_menu = menu_utama()
        
        if pilihan_menu == "0":
            print("Terima kasih telah menggunakan program ini!")
            break
        
        elif pilihan_menu == "1":
            # Menu Geometri
            while True:
                pilihan_geometri = menu_geometri()
                
                if pilihan_geometri == "0":
                    break
                elif pilihan_geometri == "1":
                    hitung_persegi()
                elif pilihan_geometri == "2":
                    hitung_persegi_panjang()
                elif pilihan_geometri == "3":
                    hitung_lingkaran()
                else:
                    print("Pilihan tidak valid! Silakan coba lagi.")
                
                input("\nTekan Enter untuk melanjutkan...")
        
        elif pilihan_menu == "2":
            # Menu Konversi Suhu
            while True:
                pilihan_suhu = menu_konversi_suhu()
                
                if pilihan_suhu == "0":
                    break
                elif pilihan_suhu == "1":
                    konversi_cel_to_fah()
                elif pilihan_suhu == "2":
                    konversi_cel_to_kel()
                elif pilihan_suhu == "3":
                    konversi_fah_to_cel()
                elif pilihan_suhu == "4":
                    konversi_kel_to_cel()
                else:
                    print("Pilihan tidak valid! Silakan coba lagi.")
                
                input("\nTekan Enter untuk melanjutkan...")
        
        else:
            print("Pilihan tidak valid! Silakan coba lagi.")
            input("\nTekan Enter untuk melanjutkan...")

# Jalankan program utama
if __name__ == "__main__":
    main()