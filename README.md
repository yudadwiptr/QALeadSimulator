# Release Day Survival — QA Lead Simulator

Game time-management/simulator 2D pixel art: kamu adalah QA Lead yang berusaha mencegah kode rusak rilis ke production selama 5 hari sprint (Senin–Jumat), berdasarkan Game Design Document "Release Day Survival".

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:5173. Build production: `npm run build` (hasil di `dist/`).

## Fitur (mapping ke GDD)

| GDD | Implementasi |
| --- | --- |
| Kanban Board (antrean QA) | Tiket muncul berkala di kolom QA, kecepatan naik per hari |
| Inspeksi Tiket | Modal tiket dengan tab Diff Kode / Server Log / Catatan Dev. Log selalu jujur; kode & catatan dev bisa menipu (tiket "jebakan") |
| Approve / Reject | Approve kode rusak → Server Health anjlok. Reject kode bersih → dev ngambek, tiket balik sebagai rework makin lambat |
| Server Health | Mulai 100%, game over "Server Kebakar" di 0%. Tim ops menambal +25% tiap malam |
| Stamina System | Membaca log menguras stamina; layar/log makin blur. Klik gelas kopi di meja → +40 stamina (cooldown 15 dtk) |
| Progresi 5 hari | Senin (Easy, tiket UI ringan) → Rabu (API timeout, DB error, catatan dev palsu) → Jumat (Release Day: 2x kecepatan, tiket CRITICAL ber-timer belasan detik) |
| Endings | QA Legend (antrean bersih + health >50%), Server Kebakar (health 0%), Overtime Mania (selamat tapi antrean menumpuk) |
| Character Customizer | Layer PNG modular: body/outfit (3), rambut (4), kacamata, lanyard. Tersimpan di localStorage |
| P2W satir | QA Shop: Auto-Fix (500), Siren Coffee (250), Pro Shield (750), QA Bot (1000). Top-up "Digiflazz" diparodikan — pembayaran 100% simulasi, tidak ada uang nyata |
| Audio | SFX + BGM lofi/panik prosedural via WebAudio (tanpa file audio), tombol mute kanan-bawah |

## Struktur

- `src/game/data.js` — konfigurasi hari, template tiket (UI/logic/backend), shop, endings
- `src/game/audio.js` — SFX & BGM prosedural
- `src/components/` — TitleScreen, Customizer, DayIntro, GameScreen (game loop), TicketModal, Shop, EndScreen
- `public/assets/character/` — sprite pixel art modular (digenerate ulang dari placeholder, komposisi layer sama)
- `reference/` — mockup art asli (1–4.jfif) & starter code lama, tidak ikut ter-build

## Catatan teknis

- React 18 + Vite 6 + Tailwind CSS 4.
- GDD menyebut target Tauri (.exe); web build ini adalah intinya — bungkus Tauri bisa ditambahkan belakangan tanpa mengubah kode game.
