# Product Requirements Document (PRD)
## Virtual Museum — Museum 3D Interaktif dengan Fitur AR

---

## 1. Ringkasan Eksekutif

**Virtual Museum** adalah aplikasi web berbasis A-Frame yang menyediakan pengalaman museum 3D interaktif dengan fitur Augmented Reality (AR). Pengguna dapat menjelajahi galeri virtual, berinteraksi dengan koleksi seni dan artefak, melihat informasi detail, serta mengalami karya seni dalam lingkungan nyata melalui AR Viewer.

**Target Pengguna:**
- Penggemar seni dan sejarah
- Pelajar dan akademisi
- Wisatawan virtual
- Museum dan institusi budaya

**Platform:** Web (Desktop & Mobile)

---

## 2. Tujuan Produk

1. **Aksesibilitas Global** — Membuat koleksi seni dan artefak dapat diakses oleh siapa saja, kapan saja tanpa batasan geografis
2. **Pengalaman Immersive** — Memberikan pengalaman menjelajahi museum 3D yang interaktif dan menarik
3. **Edukasi Interaktif** — Menyediakan informasi mendalam tentang setiap karya dengan visual 3D
4. **Teknologi AR** — Memungkinkan pengguna melihat karya seni dalam lingkungan mereka sendiri
5. **User Experience Mobile-First** — Memastikan aksesibilitas penuh di perangkat mobile

---

## 3. Fitur Utama

### 3.1 Virtual Gallery (Galeri Virtual 3D)

**Deskripsi:**
Ruangan 3D yang dapat dijelajahi dengan arsitektur galeri klasik yang menampilkan koleksi seni.

**Spesifikasi:**
- **Lingkungan:** Ruangan persegi panjang dengan lantai, dinding, dan plafon bertekstur marmer
- **Ukuran Ruangan:** 16 × 20 meter (dalam koordinat 3D)
- **Pencahayaan:** Ambient lighting + directional lights + point lights untuk menciptakan suasana museum profesional
- **Navigasi:**
  - Desktop: WASD untuk bergerak, Mouse untuk mengontrol pandangan (pointer lock)
  - Mobile: D-pad virtual (▲ ▼ ◀ ▶) di sudut kiri bawah
- **Fitur Boundary:** Pembatas ruangan untuk mencegah pemain keluar area
- **Kecepatan Gerak:** 2.0 unit/detik (dapat disesuaikan)

**Konten Ruangan:**
- **Lukisan di Dinding Kiri:** 3 lukisan karya Vincent van Gogh
  - The Starry Night (1889)
  - Farmhouse in Provence (1888)
- **Lukisan di Dinding Kanan:** 4 lukisan karya Vincent van Gogh
  - Self-Portrait (1889)
  - Still Life with Yellow Straw Hat
  - View of the Hague (Paddemoes)
  - Woman Sewing and Cat

---

### 3.2 Interactive Information Panel

**Deskripsi:**
Panel informasi yang muncul ketika pengguna mengklik objek interaktif di galeri.

**Spesifikasi:**
- **Trigger:** Klik pada lukisan atau artefak yang berlogo `[Klik untuk info]`
- **Konten Ditampilkan:**
  - Judul karya (uppercase, warna emas)
  - Tahun pembuatan dan seniman
  - Deskripsi lengkap (italic, 13px)
  - Tombol "🔍 Lihat di AR" (untuk membuka AR Viewer)
  - Tombol "✕ Tutup"
- **Animasi:** Slide up dengan smooth transition (350ms)
- **Posisi:** Tengah layar, 80px dari bawah
- **Responsif:** Lebar maksimal 420px atau 90vw (mobile)
- **Design:** Dark theme dengan border gradient, backdrop blur effect

---

### 3.3 AR Viewer (Mode Augmented Reality)

**Deskripsi:**
Halaman terpisah yang menggunakan marker-based AR (AR.js) untuk menampilkan karya seni/artefak 3D dalam lingkungan nyata pengguna.

**Spesifikasi:**
- **Teknologi:** AR.js + A-Frame (marker preset: Hiro)
- **Sumber Kamera:** Webcam perangkat (environment facing)
- **Resolusi:** 1280×960
- **Marker Detection:** Real-time marker detection dengan feedback visual
- **Konten AR:**
  - Stag Statue (model 3D berputar)
  - Classical Statue
  - Mayan Temple
  - 6 lukisan Van Gogh (dapat ditampilkan sebagai 2D plane)

**UI AR Viewer:**
- **Header:** 
  - Tombol "← Museum" (kembali ke galeri)
  - Nama koleksi yang sedang ditampilkan
- **Marker Guide:**
  - Frame visual dengan sudut corner
  - Icon marker (⬛)
  - Instruksi: "Arahkan kamera ke marker Hiro"
- **Status Bar:**
  - Indicator dot (kuning = searching, hijau = detected)
  - Status text real-time
- **Permission Error Modal:**
  - Notifikasi jika akses kamera ditolak
  - Instruksi browser yang kompatibel (Chrome untuk Android, Safari untuk iOS)
  - Tombol "Coba Lagi"

**Parameter URL:**
- `id` — ID koleksi yang akan ditampilkan (e.g., `ar-viewer.html?id=painting-1`)
- Fallback: Gunakan sessionStorage atau window.name jika query string tidak tersedia

---

### 3.4 HUD (Heads-Up Display)

**Elemen HUD:**
1. **Museum Title** — Judul "Museum Virtual" di atas tengah
2. **Crosshair** — Garis silang di tengah layar (indikator aim point)
3. **Tooltip Hover** — Teks `[ Klik untuk info ]` ketika mouse hover interactable objects
4. **Navigation Hint** — Petunjuk kontrol di bawah (WASD / Mouse / Klik)
5. **Mobile Controls** — D-pad virtual untuk mobile (tersembunyi di desktop)
6. **Info Panel** — Panel informasi interaktif (detail di fitur 3.2)

---

### 3.5 Mobile Responsiveness

**Fitur Mobile:**
- **Viewport Meta Tags:** `maximum-scale=1.0`, `user-scalable=no` (fullscreen experience)
- **Touch-Action:** `none` pada D-pad untuk mencegah double-tap zoom
- **D-pad Controls:**
  - Diposisikan di kiri bawah layar
  - 4 tombol arah (44×44px)
  - Radius border: 12px
  - Styling: semi-transparent dengan inset shadow
  - Touch events: mousedown/mouseup (cross-browser compatible)
- **Responsive Font Size:** Menggunakan `clamp()` untuk skalabilitas
- **Full Screen Mode:** Support untuk `mobile-web-app-capable` dan `apple-mobile-web-app-capable`

---

## 4. User Stories

### 4.1 Galeri Virtual

**User Story 1: Menjelajahi Galeri**
```
Sebagai pengunjung museum virtual,
Saya ingin dapat berjalan di sekitar galeri 3D
Agar saya dapat melihat koleksi seni dari berbagai sudut pandang
```
**Acceptance Criteria:**
- Tombol WASD (desktop) atau D-pad (mobile) bergerak pemain dengan halus
- Pemain tidak dapat keluar dari batas ruangan
- Kecepatan bergerak konsisten
- Mouse/touch dapat memutar pandangan

**User Story 2: Melihat Informasi Karya Seni**
```
Sebagai pengunjung museum virtual,
Saya ingin mengklik lukisan untuk melihat detail informasi
Agar saya dapat belajar tentang setiap karya seni
```
**Acceptance Criteria:**
- Hover pada karya menampilkan tooltip `[ Klik untuk info ]`
- Klik membuka panel dengan judul, tahun, dan deskripsi
- Panel dapat ditutup dengan tombol ✕
- Transisi smooth dan responsif

### 4.2 AR Viewer

**User Story 3: Melihat Karya dalam AR**
```
Sebagai pengunjung museum,
Saya ingin melihat karya seni dalam lingkungan nyata saya melalui AR
Agar saya dapat merasakan pengalaman yang lebih immersive
```
**Acceptance Criteria:**
- Tombol "🔍 Lihat di AR" membuka halaman AR dengan karya yang dipilih
- Marker detection bekerja dengan marker Hiro standard
- Status indicator menunjukkan apakah marker terdeteksi
- Dapat kembali ke galeri dengan tombol "← Museum"

**User Story 4: Mobile AR Experience**
```
Sebagai pengguna mobile,
Saya ingin menggunakan AR viewer di smartphone saya
Agar saya dapat melihat koleksi museum dalam AR di perangkat saya
```
**Acceptance Criteria:**
- Browser kompatibel: Chrome (Android), Safari (iOS)
- Meminta izin kamera dan menampilkan instruksi jika ditolak
- Performa stabil tanpa lag
- UI responsif untuk layar mobile

---

## 5. Technical Requirements

### 5.1 Technology Stack

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Engine 3D | A-Frame | 1.5.0 (galeri), 1.6.0 (AR) |
| AR Framework | AR.js | 3.4.8 |
| Model 3D | glTF/GLB | Standard |
| Tekstur | JPG | 4K Resolution |
| Frontend | HTML5 + CSS3 + JavaScript | Vanilla JS |
| Styling | CSS3 | Flexbox, Grid, Animations |

### 5.2 Browser Compatibility

**Desktop:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile:**
- Android: Chrome 90+, Firefox 88+
- iOS: Safari 14.5+

**Catatan:** AR Viewer memerlukan HTTPS atau localhost

### 5.3 Asset Requirements

**3D Models:**
- Stag Statue (GLB format)
- Classical Statue (GLB format)
- Mayan Temple (GLB format)
- Format: glTF 2.0
- Recommended texture size: 1K-4K
- Rigging: Simplified untuk optimasi performa

**Images:**
- Lukisan: JPG format, ~2048×1536px minimum
- Tekstur Ruangan: 4K JPG (Marble tileable)
- Marker: Standard Hiro marker (included di AR.js)

**Audio:** (Optional future enhancement)
- Background music: MP3 format, ~2-3MB
- Ambient sounds: WAV format

### 5.4 Performance Requirements

- **Load Time:** < 5 detik (desktop dengan koneksi 4G)
- **FPS:** 30+ FPS pada desktop, 24+ FPS pada mobile
- **Model Draw Call:** Optimized dengan material merging
- **Bundle Size:** < 20MB (including models & textures)
- **Memory Usage:** < 256MB (mobile), < 512MB (desktop)

---

## 6. Design & UX

### 6.1 Visual Theme

- **Color Palette:**
  - Primary: #0a0602 (Deep brown/black)
  - Accent: #e8c97a (Gold)
  - Secondary: #f5e6c8 (Beige/cream)
  - UI: #2e75b6 (Blue) untuk tombol AR
  
- **Typography:**
  - Font Family: Georgia, serif
  - Heading: 22px, uppercase, letter-spacing 4px
  - Body: 13px, letter-spacing 1px

### 6.2 Accessibility

- **Keyboard Navigation:** WASD + Mouse untuk desktop
- **Touch Support:** D-pad untuk mobile
- **Color Contrast:** Minimum WCAG AA
- **ARIA Labels:** `aria-label` pada tombol dan kontrol
- **Mobile Zoom:** Disabled (fullscreen UX)
- **Screen Reader:** Support basic navigation

### 6.3 Responsive Breakpoints

- **Desktop:** 1024px+ (fullscreen scene)
- **Tablet:** 768px - 1023px (adjusted UI scale)
- **Mobile:** < 768px (mobile D-pad, optimized UI)

---

## 7. Backend/Data Structure (Jika diperluas)

### 7.1 Collection Data Model

```javascript
{
  id: "painting-1",
  type: "painting|artifact",
  title: "The Starry Night",
  year: "Vincent van Gogh, 1889",
  description: "...",
  position: { x: -7.6, y: 2.2, z: -4 },
  rotation: { x: 0, y: 90, z: 0 },
  asset: {
    image: "path/to/image.jpg",
    model: "path/to/model.glb"
  },
  arMapping: {
    elementId: "ar-painting-1",
    arLabel: "The Starry Night"
  }
}
```

### 7.2 Backend API (Future - Optional)

Endpoint yang mungkin diperlukan untuk museum multipel:
- `GET /api/museums` — Daftar museum
- `GET /api/museums/:id/collections` — Koleksi dalam museum
- `GET /api/collections/:id` — Detail koleksi
- `POST /api/visits` — Analytics pengunjung (optional)

---

## 8. Roadmap Pengembangan

### Phase 1: MVP (Current)
- [x] Virtual Gallery dengan 6 lukisan Van Gogh
- [x] Interactive Info Panel
- [x] AR Viewer dengan 3 artefak
- [x] Mobile D-pad controls
- [ ] Documentation & deployment

### Phase 2: Enhancement
- [ ] Multi-room galleries (ruangan berbeda untuk genre seni)
- [ ] 360° panorama scene option
- [ ] Audio guide / narasi (text-to-speech atau audio)
- [ ] Guest book / visitor feedback
- [ ] Analytics dashboard

### Phase 3: Advanced Features
- [ ] Image-based AR (WebAR tanpa marker)
- [ ] Multiplayer virtual tour (sync camera position)
- [ ] VR support (headset compatibility)
- [ ] Social sharing (AR screenshot)
- [ ] Backend CMS untuk manage koleksi dinamis

### Phase 4: Integration
- [ ] Mobile app (React Native / Flutter wrapper)
- [ ] REST API for third-party integration
- [ ] Museum database synchronization
- [ ] Custom branding per institusi

---

## 9. Success Metrics

| Metrik | Target | Pengukuran |
|--------|--------|-----------|
| User Retention | 60% | 30-day return visits |
| Load Time | < 5s | Lighthouse/WebPageTest |
| Mobile Usage | 40%+ | Google Analytics |
| AR Feature Usage | 25%+ | Event tracking |
| User Satisfaction | 4.0+ | Survey/NPS score |
| Performance (FPS) | 30+ FPS | Frame rate monitor |
| Error Rate | < 1% | Browser error logging |

---

## 10. Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Browser compatibility issues (AR on iOS) | High | Safari WebAR testing, clear documentation |
| Performance on low-end devices | Medium | Progressive enhancement, LOD optimization |
| User confusion (UX) | Medium | Interactive tutorial, clear UI hints |
| Camera permission denial | Medium | Clear permission explanation, fallback mode |
| Marker detection issues (poor lighting) | Medium | Marker guide with instructions |
| Asset loading failures | High | Fallback placeholder, offline mode consideration |

---

## 11. Glossary

- **A-Frame** — Web framework untuk membangun VR/AR experiences
- **AR.js** — Library JavaScript untuk marker-based AR
- **glTF/GLB** — Format model 3D standard (GL Transmission Format)
- **HIRO Marker** — QR-code like marker standard untuk AR.js
- **Raycaster** — Teknologi untuk mendeteksi interaksi (click/hover) pada object 3D
- **HUD** — Heads-Up Display (elemen UI overlay di layar)
- **D-pad** — Directional pad (kontrol navigasi 4-arah)

---

## 12. Appendix

### A. File Structure

```
virtual-museum/
├── index.html              # Galeri virtual utama
├── ar-viewer.html          # AR viewer page
├── README.md               # Project documentation
├── PRD.md                  # Product requirements (file ini)
├── css/
│   └── style.css           # Styling untuk galeri
├── js/
│   ├── interactions.js      # Event handling & scene interactions
│   └── ar-viewer.js        # AR viewer logic
└── assets/
    ├── images/             # Tekstur & lukisan (JPG, MTLX, TRES, USDC)
    └── models/             # 3D models (GLB)
```

### B. Key Code Snippets Reference

**Collection Data Structure:**
```javascript
const COLLECTION_MAP = {
  'painting-1': { elId: 'ar-painting-1', label: 'The Starry Night' },
  'artifact-1': { elId: 'ar-artifact-1', label: 'Stag Statue' },
  // ... more entries
};
```

**Scene Initialization (A-Frame):**
```html
<a-scene background="color: #1a1208" fog="type: linear; color: #1a1208; near: 10; far: 30"
  cursor="rayOrigin: mouse; fuse: false" raycaster="objects: .interactable">
```

**Mobile Control Handler:**
```javascript
for (const button of dpadButtons) {
  const direction = button.dataset.dir;
  button.addEventListener('mousedown', () => setDirectionState(direction, 1));
  button.addEventListener('mouseup', () => setDirectionState(direction, 0));
}
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-04  
**Author:** Development Team  
**Status:** Active

