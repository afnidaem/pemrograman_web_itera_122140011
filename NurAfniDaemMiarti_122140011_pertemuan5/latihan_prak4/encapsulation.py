class Student:
    def __init__(self, name, nim):
        self.name = name           # Public attribute
        self._program = "Teknik"   # Protected attribute (konvensi)
        self.__id = "2023-" + nim  # Private attribute

    # Public method
    def display_info(self):
        return f"Name: {self.name}, Program: {self._program}, ID: {self.__id}"

    # Property decorator
    @property
    def program(self):
        return self._program

    @program.setter
    def program(self, value):
        if value in ["Teknik", "Sains", "Bisnis", "Teknik Informatika", "Hukum"]:
            self._program = value
        else:
            print("Program tidak valid")

    # Property decorator untuk ID
    @property
    def id(self):
        return self.__id

# Membuat instance
student1 = Student("Budi", "12345")

# Mengakses public attribute
print(f"Nama: {student1.name}")

# Mengakses protected attribute (dapat diakses, tapi secara konvensi seharusnya tidak)
print(f"Program (protected): {student1._program}")

# Mengakses private attribute menggunakan property
print(f"ID: {student1.id}")

# Menggunakan property
print(f"Program via property: {student1.program}")

# Menggunakan property setter
student1.program = "Sains"
print(f"Program setelah diubah: {student1.program}")

# Mencoba mengubah dengan nilai yang tidak valid
student1.program = "Hukum"  
print(f"Program setelah diubah: {student1.program}")

# Mencoba mengubah dengan nilai yang valid
student1.program = "Teknik Informatika"
print(f"Program setelah diubah: {student1.program}")
