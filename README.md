# BengkelKu — Frontend

Antarmuka web untuk booking servis, riwayat perawatan, dan pengingat kendaraan.
Proyek 1 Pengembangan Aplikasi Berbasis Web (PABWE 2026).

> Repository ini berpasangan dengan **backend**: `ifs24030-pabwe2026-p1-backend`.
> Backend harus berjalan agar aplikasi ini berfungsi.

**Teknologi:** Nuxt 4 (SPA, TypeScript), Pinia, Tailwind CSS v4, lucide-vue-next, SweetAlert2, Vitest.

## Hubungan dengan backend

| Pengaturan | Di mana | Fungsi |
|---|---|---|
| `VITE_API_BASEURL` | `.env` repo ini (dipakai saat build/dev) | URL API backend, mis. `http://localhost:8000/api` |
| `CORS_ORIGINS` | `.env` backend | Harus memuat URL frontend ini (mis. `http://localhost:3000`) |

## Struktur

```
src/
├── features/      satu folder per fitur (api/ states/ pages/ components/ modals/ layouts/)
├── helpers/       apiHelper, toolsHelper, actionHelper
├── hooks/         useInput
├── middleware/    penjaga rute global
├── routes.ts      deklarasi rute
└── router.options.ts
```

Alur: `page → store (Pinia) → api → apiHelper → REST API backend`.

## Menjalankan lokal

Prasyarat: Node.js 20+ (atau Bun), dan backend sudah jalan di `http://localhost:8000`.

```bash
git clone https://github.com/<username>/ifs24030-pabwe2026-p1-frontend.git
cd ifs24030-pabwe2026-p1-frontend
cp .env.example .env     # sesuaikan VITE_API_BASEURL bila backend berada di alamat lain
npm install              # atau: bun install
npm run dev              # http://localhost:3000
```

**Akun demo** (data dari backend)

| Role | Email | Kata sandi |
|---|---|---|
| Admin | admin@bengkelku.id | Admin123! |
| Pelanggan | budi@example.com | Customer123 |

## Pengujian

```bash
npm run test:coverage     # lapisan logika wajib 100%
```

## Docker

```bash
VITE_API_BASEURL=http://localhost:8000/api docker compose up -d --build
# http://localhost:3000
```

## Deployment online

SPA statis. Build dengan `VITE_API_BASEURL=https://<url-backend>/api npx nuxt generate`, lalu publikasikan `.output/public` ke Netlify, Vercel, atau Nginx. `public/_redirects` dan `vercel.json` menangani fallback rute SPA. Setelah dapat URL frontend, masukkan ke `CORS_ORIGINS` di backend.

## Jenkins

`Jenkinsfile`: checkout, test, build, lalu deploy dengan `docker compose`. Parameter `VITE_API_BASEURL` menentukan URL backend. Buat job *Pipeline from SCM* yang menunjuk ke repository ini.
