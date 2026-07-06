# Virtual Museum — Museum 3D Interaktif dengan Fitur AR

Aplikasi web berbasis **A-Frame** dan **AR.js** yang menyediakan pengalaman menjelajahi galeri museum 3D secara interaktif langsung dari peramban (browser), lengkap dengan fitur *Augmented Reality* (AR) untuk memproyeksikan artefak ke dunia nyata.

## 🚀 Fitur Utama

* **Galeri Virtual 3D:** Jelajahi ruang pameran klasik (16×20 meter) menggunakan kontrol keyboard (WASD + Mouse) di desktop atau D-pad virtual di perangkat mobile.
* **Panel Informasi Interaktif:** Dapatkan informasi detail (judul, tahun, seniman, dan deskripsi) cukup dengan mengklik lukisan atau artefak yang ada.
* **AR Viewer (Marker-Based):** Proyeksikan model 3D (seperti *Stag Statue*, *Classical Statue*, dan lukisan Van Gogh) ke lingkungan sekitar Anda menggunakan kamera perangkat dan marker **Hiro**.
* **Desain Responsif & Mobile-First:** Antarmuka yang dioptimalkan untuk perangkat seluler lengkap dengan fitur pencegahan *zoom* otomatis demi kenyamanan navigasi sentuh.

---

## 🛠️ Tech Stack

| Komponen | Teknologi | Versi |
| :--- | :--- | :--- |
| **3D Engine** | A-Frame | 1.5.0 (Gallery) / 1.6.0 (AR) |
| **AR Framework** | AR.js | 3.4.8 |
| **Format Model 3D** | glTF / GLB | Standard 2.0 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | - |

---

## 📂 Struktur Berkas

```text
virtual-museum/
├── index.html              # Galeri virtual utama (3D Scene)
├── ar-viewer.html          # Halaman AR viewer
├── README.md               # Dokumentasi proyek (File ini)
├── PRD.md                  # Product Requirements Document
├── css/
│   └── style.css           # Styling UI & HUD overlay
├── js/
│   ├── interactions.js     # Logika interaksi & kontrol galeri
│   └── ar-viewer.js        # Logika deteksi marker & integrasi AR
└── assets/
    ├── images/             # Tekstur marmer & gambar lukisan (JPG)
    └── models/             # Model 3D objek/patung (GLB)