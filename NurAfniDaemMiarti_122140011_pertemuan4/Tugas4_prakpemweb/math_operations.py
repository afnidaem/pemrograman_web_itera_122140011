# Konstanta
PI = 3.14159

# Fungsi-fungsi untuk menghitung luas dan keliling bentuk geometri
def luas_persegi(sisi):
    """Menghitung luas persegi"""
    return sisi * sisi

def keliling_persegi(sisi):
    """Menghitung keliling persegi"""
    return 4 * sisi

def luas_persegi_panjang(panjang, lebar):
    """Menghitung luas persegi panjang"""
    return panjang * lebar

def keliling_persegi_panjang(panjang, lebar):
    """Menghitung keliling persegi panjang"""
    return 2 * (panjang + lebar)

def luas_lingkaran(jari_jari):
    """Menghitung luas lingkaran"""
    return PI * jari_jari * jari_jari

def keliling_lingkaran(jari_jari):
    """Menghitung keliling (circumference) lingkaran"""
    return 2 * PI * jari_jari

# Fungsi-fungsi untuk konversi suhu
def celsius_ke_fahrenheit(celsius):
    """Mengkonversi suhu dari Celsius ke Fahrenheit"""
    return (celsius * 9/5) + 32

def celsius_ke_kelvin(celsius):
    """Mengkonversi suhu dari Celsius ke Kelvin"""
    return celsius + 273.15

def fahrenheit_ke_celsius(fahrenheit):
    """Mengkonversi suhu dari Fahrenheit ke Celsius"""
    return (fahrenheit - 32) * 5/9

def kelvin_ke_celsius(kelvin):
    """Mengkonversi suhu dari Kelvin ke Celsius"""
    return kelvin - 273.15