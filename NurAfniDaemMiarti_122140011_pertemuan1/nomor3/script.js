// Ambil elemen input dan pesan error
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");

let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");

// Tambahkan event listener untuk validasi setelah mengetik dan keluar (onblur)
nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

// Event listener saat submit ditekan
document.getElementById("myForm").addEventListener("submit", function(event) {
    let isValid = validateForm();
    if (!isValid) {
        event.preventDefault(); // Cegah pengiriman jika tidak valid
    } else {
        alert("Form berhasil dikirim!");
        document.getElementById("myForm").reset();
    }
});

function validateName() {
    let name = nameInput.value.trim();
    if (name.length < 3) {
        nameError.style.display = "block"; // Tampilkan error
        return false;
    } else {
        nameError.style.display = "none"; // Sembunyikan error jika valid
        return true;
    }
}

function validateEmail() {
    let email = emailInput.value.trim();
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailError.style.display = "block"; 
        return false;
    } else {
        emailError.style.display = "none"; 
        return true;
    }
}

function validatePassword() {
    let password = passwordInput.value.trim();
    if (password.length < 8) {
        passwordError.style.display = "block"; 
        return false;
    } else {
        passwordError.style.display = "none"; 
        return true;
    }
}

function validateForm() {
    let isValid = true;
    if (!validateName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    return isValid;
}