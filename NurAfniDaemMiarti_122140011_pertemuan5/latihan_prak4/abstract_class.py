from abc import ABC, abstractmethod

# Abstract Base Class
class Shape(ABC):
    @abstractmethod
    def area(self):
        """Method ini harus diimplementasikan oleh subclass"""
        pass
    
    @abstractmethod
    def perimeter(self):
        """Method ini harus diimplementasikan oleh subclass"""
        pass
    
    def describe(self):
        """Method non-abstract (tidak wajib di-override)"""
        return "Ini adalah bentuk geometris"

# Concrete class (mengimplementasikan abstract methods)
class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)
    
    # Override method non-abstract
    def describe(self):
        return f"Ini adalah persegi panjang dengan lebar {self.width} dan tinggi {self.height}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2
    
    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

# Error jika mencoba instantiate abstract class
try:
    shape = Shape()  # Akan menghasilkan TypeError
except TypeError as e:
    print(f"Error saat membuat instance dari Shape: {e}")

# Membuat instance dari concrete classes
rectangle = Rectangle(5, 4)
circle = Circle(3)

# Menggunakan method
print(f"Luas persegi panjang: {rectangle.area()}")
print(f"Keliling persegi panjang: {rectangle.perimeter()}")
print(f"Deskripsi persegi panjang: {rectangle.describe()}")

print(f"Luas lingkaran: {circle.area():.2f}")
print(f"Keliling lingkaran: {circle.perimeter():.2f}")
print(f"Deskripsi lingkaran: {circle.describe()}")