# MyLibrare App

**MyLibrare App** adalah aplikasi berbasis web yang memungkinkan pengguna untuk mengelola koleksi buku mereka secara efisien. Pengguna dapat mencatat buku yang dimiliki, sedang dibaca, atau ingin dibeli, serta melakukan berbagai operasi seperti menambah, mengedit, dan menghapus buku. Aplikasi ini juga menyediakan fitur pencarian dan filter untuk memudahkan pengguna dalam menemukan buku sesuai dengan statusnya.

## Deskripsi Aplikasi

Aplikasi ini dirancang untuk membantu pengguna dalam:
- **Menambah Buku Baru**: Pengguna dapat menambahkan buku baru dengan mencantumkan informasi seperti **judul**, **penulis**, dan **status** (dimiliki, sedang dibaca, atau ingin dibeli).
- **Mengedit dan Menghapus Buku**: Pengguna dapat mengedit atau menghapus buku yang sudah ada dalam daftar koleksi.
- **Filter Buku Berdasarkan Status**: Pengguna dapat memfilter buku berdasarkan statusnya (dimiliki, sedang dibaca, atau ingin dibeli).
- **Pencarian Buku**: Pengguna dapat mencari buku dengan kata kunci tertentu.

## Instruksi Instalasi dan Menjalankan Aplikasi
### Prasyarat

Sebelum mulai, pastikan Anda telah menginstal **Node.js** dan **npm** (Node Package Manager) di komputer Anda. Anda dapat memeriksa apakah keduanya sudah terinstal dengan menjalankan perintah berikut di terminal:

```bash
node -v
npm -v
```

### Langkah-langkah Instalasi
1. Clone Repository
   
Clone repository aplikasi React ke dalam folder lokal menggunakan perintah berikut:

```bash
git clone https://github.com/afnidaem/pemrograman_web_itera_12240011.git
```

2. Masuk ke Direktori Proyek
   
Setelah repository di-clone, masuk ke dalam folder proyek dengan perintah:

```bash
cd repository-name
```

3. Install Dependensi

Setelah masuk ke dalam folder proyek, jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan menggunakan npm:

```bash
npm install
```
Perintah ini akan menginstal semua paket yang terdaftar di package.json proyek Anda, termasuk React dan pustaka lainnya yang digunakan oleh aplikasi.

4. Menjalankan Aplikasi

Setelah semua dependensi terinstal, jalankan aplikasi React di mode pengembangan dengan perintah:

```bash
npm start
```
Perintah ini akan menjalankan aplikasi pada localhost:3000. Secara otomatis, aplikasi akan terbuka di browser Anda. Jika aplikasi tidak terbuka, buka browser dan navigasikan ke:

```arduino
http://localhost:3000
```

Setelah menjalankan perintah npm start, aplikasi Anda akan berjalan di localhost:3000. Pastikan aplikasi berjalan dengan memeriksa antarmuka aplikasi di browser.

## Screenshots Antarmuka

### Halaman Buku Saya (Sebelum data buku diinputkan)
![Screenshot 2025-04-19 202831](https://github.com/user-attachments/assets/20d16c08-f4a3-420c-9b17-2dded4acd370)

### Halaman Buku Saya (Setelah buku ditambahkan)
![Screenshot 2025-04-19 203149](https://github.com/user-attachments/assets/13bc443f-c4b0-4a5e-a850-dc87ca92dd89)

### Formulir untuk Menambahkan Buku
![Screenshot 2025-04-19 202943](https://github.com/user-attachments/assets/cbfd911a-ee2c-4596-8450-5fe75bedd3fd)

### Formulir untuk Mengubah Data Buku
![Screenshot 2025-04-19 203401](https://github.com/user-attachments/assets/8ac052bc-239f-4849-83e0-2b7b25624652)

### Halaman Statistik
![Screenshot 2025-04-19 203229](https://github.com/user-attachments/assets/e8c402bc-8d57-488a-9fb0-594b7fb608fb)
![Screenshot 2025-04-19 203252](https://github.com/user-attachments/assets/833cd6f0-e52d-4eb6-ae0a-46163d98df20)

### Tampilan Hasil Pencarian
![Screenshot 2025-04-19 203335](https://github.com/user-attachments/assets/d2603f84-6b77-44e3-97ef-5f97fcea2bdd)


## Penjelasan Fitur React yang digunakan
Aplikasi ini menggunakan beberapa fitur dari React untuk membangun antarmuka yang interaktif dan responsif:

### React State & useState Hook:

Digunakan untuk mengelola status aplikasi, seperti daftar buku, status buku, dan status UI lainnya (misalnya, apakah modal terbuka atau tidak).

### useEffect Hook:

Digunakan untuk melakukan side-effect seperti mengambil data dari server (jika diperlukan) dan memanipulasi DOM setelah rendering.

### React Context API:

Digunakan untuk membagikan data status dan fungsi aplikasi ke seluruh aplikasi, misalnya untuk pengelolaan daftar buku di seluruh aplikasi tanpa harus melempar props ke setiap komponen.

### React Router:

Digunakan untuk mengelola routing aplikasi sehingga pengguna dapat berpindah antara halaman Buku Saya, dan Statistik.

### Form Handling:

Pengguna dapat menambah atau mengedit buku dengan form input. React controlled components digunakan untuk mengelola nilai form.

## Laporan testing (screenshots hasil test)

Berikut tangkapan layar dari hasil testing unit:
![image](https://github.com/user-attachments/assets/74b2c7ee-aada-46ec-a173-184c2c8249c4)
