# Contoh if-else
nilai = int(input("Masukkan nilai (0-100): "))
grade = ""

# If-elif-else
if nilai >= 90:
    grade = "A"
elif nilai >= 80:
    grade = "B"
elif nilai >= 70:
    grade = "C"
elif nilai >= 60:
    grade = "D"
else:
    grade = "E"

print(f"Nilai: {nilai}, Grade: {grade}")

# Keterangan kelulusan
if nilai >= 60:
    print("Status: LULUS")
else:
    print("Status: TIDAK LULUS")

# Nested if
print("\nKeterangan:")
if nilai >= 60:
    if nilai >= 90:
        print("Excellent!")
    elif nilai >= 80:
        print("Great job!")
    else:
        print("Good, keep improving!")
else:
    if nilai >= 40:
        print("Need more practice")
    else:
        print("Need serious attention")

# Ternary operator
status = "LULUS" if nilai >= 60 else "TIDAK LULUS"
print(f"Status (ternary): {status}")

# Multiple conditions
if nilai >= 80 and nilai <= 100:
    print("Nilai sangat baik")
elif nilai >= 60 or nilai == 55:
    print("Nilai cukup")
elif not (nilai < 40):
    print("Nilai di atas 40") 