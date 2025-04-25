beratBadan = float(input("Masukkan Berat Badan Anda (dalam kg): "))
tinggiBadan = float(input("Masukkan Tinggi Badan Anda (dalam m): "))

print(f"Berat badan dan tinggimu adalah {beratBadan} kg dan {tinggiBadan} m.\n")


bmi = beratBadan / (tinggiBadan * tinggiBadan)

# If-elif-else
if bmi < 18.5:
    grade = "Berat badan kurang!"
elif bmi >= 18.5 and bmi < 25:
    grade = "Berat badan normal!"
elif bmi >= 25 and bmi < 30:
    grade = "Berat badan berlebih!"
elif bmi >= 30:
    grade = "Obesitas"
else:
    grade = "Input tidak sesuai!"

print(f"BMI: {bmi} dalam kategori: {grade}\n")