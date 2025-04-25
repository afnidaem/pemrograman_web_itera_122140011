# For loop dengan range
print("For loop dengan range:")
for i in range(5):  # 0, 1, 2, 3, 4
    print(i, end=" ")
print()

# Range dengan start, stop, step
print("\nRange dengan start, stop, step:")
for i in range(2, 10, 2):  # 2, 4, 6, 8
    print(i, end=" ")
print()

# For loop dengan list
print("\nFor loop dengan list:")
buah = ["Apel", "Jeruk", "Mangga", "Pisang"]
for item in buah:
    print(item)

# For loop dengan enumerate (mendapatkan indeks)
print("\nFor loop dengan enumerate:")
for index, item in enumerate(buah):
    print(f"Index {index}: {item}")

# While loop
print("\nWhile loop:")
count = 0
while count < 5:
    print(count, end=" ")
    count += 1
print()

# While dengan break
print("\nWhile dengan break:")
angka = 0
while True:
    print(angka, end=" ")
    angka += 1
    if angka >= 5:
        break
print()

# For loop dengan continue
print("\nFor loop dengan continue:")
for i in range(10):
    if i % 2 == 0:  # Skip bilangan genap
        continue
    print(i, end=" ")
print()

# Nested loops
print("\nNested loops (multiplication table):")
for i in range(1, 5):
    for j in range(1, 5):
        print(f"{i}x{j}={i*j}", end="\t")
    print()

# Loop dengan else
print("\nLoop dengan else:")
for i in range(5):
    print(i, end=" ")
else:
    print("Loop selesai")

# List comprehension - cara singkat untuk membuat list
print("\nList comprehension:")
squares = [x**2 for x in range(1, 6)]
print("Squares:", squares)