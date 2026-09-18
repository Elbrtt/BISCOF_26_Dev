# BISCOF 26 — Booth Showcase

Landing page / web infografis untuk paper **“Comparison of Self-Learning Agents Using
Reinforcement Learning and Imitation Learning in Unreal Engine 5”** (Group 8, Bina Nusantara
University). Dibuat dengan Vue 3 + Vite, dirancang untuk ditelusuri pengunjung booth.

## Menjalankan

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev       # buka http://localhost:5173
```

Untuk versi produksi:

```bash
npm run build     # hasilnya di folder dist/
npm run preview   # mengecek hasil build secara lokal
```

Folder `dist/` sudah ikut disertakan, jadi kalau di lokasi booth tidak sempat build, isi folder
itu bisa langsung dibuka. Routing memakai hash (`#/results`), dan `base` diset `./`, jadi
`dist/index.html` tetap jalan walau dibuka langsung dari flashdisk tanpa web server.

## Enam halaman

| Rute | Isi |
| --- | --- |
| `/` | Title card: foto trek, judul, penulis, tombol ke PDF |
| `#/question` | Latar belakang, dua paradigma, research gap, tabel 10 literatur |
| `#/method` | Pipeline 7 langkah, ruang observasi, fungsi reward, konfigurasi training |
| `#/training` | Split-screen 8 agen paralel vs 10 lap demonstrasi, tangkapan Blueprint |
| `#/results` | Statistik 200 episode, cincin completion rate, grafik lap time, uji Welch |
| `#/conclusion` | Kesimpulan, future works, open data, kontribusi penulis, referensi |

Navigasi: klik rail di kiri, tombol Previous/Next di bawah, atau tombol panah ← → di keyboard.
Halaman terakhir punya tautan balik ke title supaya pengunjung berikutnya mulai dari awal.

## Mengubah isi

Semua teks dan angka ada di satu tempat: **`src/data/paper.js`**. Ubah di situ, jangan di file
view — komponen hanya membaca dari modul itu. Termasuk daftar penulis, tabel konfigurasi,
angka hasil, future works, dan referensi.

Gambar ada di `public/img/` (sudah dikompres dari PNG asli 8,2 MB jadi sekitar 1 MB total).
PDF paper ada di `public/paper/`.

## Catatan yang perlu diketahui

**Font.** Judul memakai Tinos (serif, metrik sama dengan Times New Roman — sama seperti paper
aslinya) dan Barlow / Barlow Condensed untuk angka HUD dan teks. Keduanya dimuat dari Google
Fonts, jadi butuh internet. Kalau booth tanpa jaringan, tampilan tetap rapi karena ada fallback
Times New Roman dan sans-serif sistem — tapi kalau mau aman, unduh font tersebut, taruh di
`public/fonts/`, lalu ganti tag `<link>` di `index.html` dengan `@font-face` lokal.

**Angka failed episode PPO.** Table III di paper menulis 2 (198/200 = 99,0%), sementara teks
kesimpulan dan caption Fig. 2 menulis 3. Website memakai **2** agar konsisten dengan 99,0%.
Sebaiknya angka ini diseragamkan di paper.

**Kurva distribusi lap time** di halaman Results dibangun dari mean dan simpangan baku yang
dilaporkan (PPO 9,99 ± 1,08 s; BC 10,68 ± 0,59 s), bukan dari data mentah per-episode — paper
hanya memuat statistik ringkasnya. Caption di halaman itu sudah menyatakan hal ini. Kalau data
200 episode tersedia dalam CSV, komponen `src/components/DistributionCurve.vue` bisa diganti
dengan histogram sungguhan.

**Grafik reward** menggambarkan pita μ ± 1σ (0,464 ± 0,045) dan porsi 87,4% episode di dalamnya,
bukan garis per-episode, dengan alasan yang sama.

## Aksesibilitas dan perilaku

- Responsif sampai lebar ponsel; rail kiri berubah jadi bar bawah di layar sempit.
- `prefers-reduced-motion` dihormati — semua animasi dimatikan untuk pengunjung yang sensitif.
- Fokus keyboard terlihat jelas, dan seluruh navigasi bisa dijalankan tanpa mouse.
