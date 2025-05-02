# Class dasar
class Kendaraan:
    def __init__(self, merek, tahun):
        self.merek = merek
        self.tahun = tahun
        self.odometer = 0
        
    def deskripsi(self):
        return f"{self.merek} ({self.tahun})"
    
    def baca_odometer(self):
        return f"Kendaraan ini telah berjalan sejauh {self.odometer} kilometer"
    
    def update_odometer(self, km):
        if km >= self.odometer:
            self.odometer = km
        else:
            print("Anda tidak dapat mengubah odometer!")

# Class turunan (inherited)
class Mobil(Kendaraan):
    def __init__(self, merek, tahun, tipe):
        # Memanggil constructor class parent
        super().__init__(merek, tahun)
        # Attribute tambahan
        self.tipe = tipe
        self.bensin = 100  # capacity in liters
        
    # Method tambahan
    def isi_bensin(self, liter):
        self.bensin += liter
        return f"Bensin diisi sebanyak {liter} liter. Total: {self.bensin} liter"
    
    # Method overriding
    def deskripsi(self):
        # Extend method dari parent class
        base_desc = super().deskripsi()
        return f"{base_desc} - {self.tipe}"

# Class turunan kedua
class Motor(Kendaraan):
    def __init__(self, merek, tahun, cc):
        super().__init__(merek, tahun)
        self.cc = cc
    
    def deskripsi(self):
        return f"{self.merek} ({self.tahun}) - {self.cc}cc"

# Membuat instance
kendaraan1 = Kendaraan("Generic", 2020)
mobil1 = Mobil("Toyota", 2022, "SUV")
motor1 = Motor("Honda", 2021, 150)

# Menggunakan method dari class dasar
print(kendaraan1.deskripsi())
print(mobil1.deskripsi())  # Method yang di-override
print(motor1.deskripsi())  # Method yang di-override

# Menggunakan method dari class dasar yang diwarisi
mobil1.update_odometer(1500)
print(mobil1.baca_odometer())

# Menggunakan method dari class turunan
print(mobil1.isi_bensin(20))