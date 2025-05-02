# Class dasar
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        # Method yang akan di-override oleh class turunan
        pass

# Class turunan
class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

class Cow(Animal):
    def speak(self):
        return f"{self.name} says Moo!"

# Fungsi yang mendemonstrasikan polymorphism
def animal_sound(animal):
    # Fungsi ini bisa menerima objek apa pun yang memiliki method speak()
    return animal.speak()

# Membuat instances dari berbagai class
dog = Dog("Buddy")
cat = Cat("Whiskers")
cow = Cow("Milly")

# Memanggil fungsi yang sama dengan objek yang berbeda
print(animal_sound(dog))  # Output: Buddy says Woof!
print(animal_sound(cat))  # Output: Whiskers says Meow!
print(animal_sound(cow))  # Output: Milly says Moo!

# Demonstrasi polymorphism dengan list
animals = [Dog("Rex"), Cat("Felix"), Cow("Betty")]

# Iterating melalui list objek yang berbeda
for animal in animals:
    print(animal.speak())