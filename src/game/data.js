// ---- Konfigurasi hari (Senin–Jumat) ----
export const DAYS = [
  {
    day: 1,
    name: 'Senin',
    label: 'Easy + Tutorial',
    durationSec: 105,          // durasi real-time satu hari kerja
    spawnIntervalMs: 9000,
    criticalChance: 0,
    deceptiveChance: 0.08,
    buggyChance: 0.5,
    criticalTimerSec: 30,
    categories: ['ui'],
    intro: 'Senin pagi. Sprint baru dimulai. Tugasmu sebagai QA Lead: periksa Bukti Test & pastikan Server Log hijau sebelum Approve. Nikmati kopimu selagi sempat.',
  },
  {
    day: 2,
    name: 'Selasa',
    label: 'Easy+',
    durationSec: 105,
    spawnIntervalMs: 7500,
    criticalChance: 0.1,
    deceptiveChance: 0.2,
    buggyChance: 0.52,
    criticalTimerSec: 26,
    categories: ['ui', 'logic'],
    intro: 'Selasa. Fitur baru mulai di-merge. Beberapa developer mulai mencentang "✅ semua pass" di bukti test tanpa benar-benar mengetes.',
  },
  {
    day: 3,
    name: 'Rabu',
    label: 'Normal',
    durationSec: 110,
    spawnIntervalMs: 6000,
    criticalChance: 0.25,
    deceptiveChance: 0.35,
    buggyChance: 0.55,
    criticalTimerSec: 22,
    categories: ['ui', 'logic', 'backend'],
    intro: 'Rabu. API timeout dan database error mulai muncul. JANGAN percaya klaim developer begitu saja — Server Log adalah sumber kebenaran.',
  },
  {
    day: 4,
    name: 'Kamis',
    label: 'Hard',
    durationSec: 115,
    spawnIntervalMs: 4800,
    criticalChance: 0.33,
    deceptiveChance: 0.45,
    buggyChance: 0.58,
    criticalTimerSec: 18,
    categories: ['ui', 'logic', 'backend'],
    intro: 'Kamis. H-1 release. Code freeze katanya... tapi tiket makin deras dan dev makin nekat memalsukan checklist test. Stok kopi menipis.',
  },
  {
    day: 5,
    name: 'Jumat',
    label: 'RELEASE DAY',
    durationSec: 120,
    spawnIntervalMs: 2800,
    criticalChance: 0.5,
    deceptiveChance: 0.5,
    buggyChance: 0.6,
    criticalTimerSec: 13,
    categories: ['ui', 'logic', 'backend'],
    intro: 'JUMAT. RELEASE DAY. Tiket mengalir 2x lipat. Tiket merah CRITICAL ber-timer. Satu saja lolos ke production... tamat. Bertahanlah sampai 17:00.',
  },
]

export const WORK_START = 9 * 60   // 09:00 dalam menit
export const WORK_END = 17 * 60    // 17:00 dalam menit

// ---- Template tiket ----
// evidenceOk / evidenceBad : artefak bukti test QA manual (repro, expected vs actual, checklist, status CI).
// snippetOk / snippetBad : potongan kode (flavor opsional).
// logOk / logBad : log server. Log SELALU jujur. Bukti test & catatan developer bisa dipalsukan.
const TEMPLATES = {
  ui: [
    {
      title: 'Typo di tombol Login',
      module: 'frontend/LoginPage.jsx',
      repro: 'Buka halaman /login → periksa label teks pada tombol utama',
      expected: 'Tombol bertuliskan "Login" sesuai panduan UI',
      evidenceOk: {
        actual: 'Label tombol tampil "Login" dengan benar',
        ci: 'UI Snapshot: PASS',
        checks: [
          '✅ Halaman login terbuka normal',
          '✅ Teks tombol "Login" sesuai guideline',
          '✅ Visual regression: 0 perubahan liar',
        ],
      },
      evidenceBad: {
        actual: 'Label tombol tertulis "Lgoin" (huruf g dan o terbalik)',
        ci: 'UI Snapshot: FAIL',
        checks: [
          '✅ Halaman login terbuka normal',
          '❌ Teks tombol typo menjadi "Lgoin"',
          '❌ Snapshot UI tidak cocok dengan desain',
        ],
      },
      snippetOk: `<button className="btn-primary">\n  Login\n</button>`,
      snippetBad: `<button className="btn-primary">\n  Lgoin\n</button>`,
      logOk: ['[INFO] render LoginPage OK', '[INFO] i18n key "login" resolved'],
      logBad: ['[WARN] snapshot test mismatch: "Lgoin" != "Login"', '[ERROR] UI regression detected on LoginPage'],
    },
    {
      title: 'Warna tombol Checkout salah',
      module: 'frontend/Checkout.css',
      repro: 'Masukkan barang ke keranjang → buka halaman Checkout → amati warna tombol Bayar',
      expected: 'Tombol memakai warna hijau brand (#2e9e41)',
      evidenceOk: {
        actual: 'Tombol tampil dengan warna hijau brand sesuai design system',
        ci: 'Visual Diff: PASS',
        checks: [
          '✅ Tombol Checkout dapat diklik',
          '✅ Warna sesuai variabel --brand-green',
          '✅ Audit design system lolos',
        ],
      },
      evidenceBad: {
        actual: 'Tombol berwarna pink mencolok (#ff00ff) bekas eksperimen dev',
        ci: 'Visual Diff: FAIL',
        checks: [
          '✅ Tombol Checkout dapat diklik',
          '❌ Warna tombol #ff00ff tidak sesuai brand',
          '❌ Visual diff melenceng 312px',
        ],
      },
      snippetOk: `.btn-checkout {\n  background: var(--brand-green);\n}`,
      snippetBad: `.btn-checkout {\n  background: #ff00ff; /* TODO ganti */\n}`,
      logOk: ['[INFO] stylelint pass', '[INFO] visual diff: 0 changes'],
      logBad: ['[WARN] visual diff: 312px changed', '[ERROR] brand color mismatch #ff00ff'],
    },
    {
      title: 'Icon cart tidak muncul di Safari',
      module: 'frontend/NavBar.jsx',
      repro: 'Buka homepage di browser Safari → cek icon keranjang di navigasi atas',
      expected: 'Icon keranjang tampil tajam di Chrome, Firefox, dan Safari',
      evidenceOk: {
        actual: 'Icon keranjang muncul normal di semua browser termasuk Safari 16',
        ci: 'Cross-Browser: 24/24 PASS',
        checks: [
          '✅ Tampil normal di Chrome & Firefox',
          '✅ Tampil normal di Safari 16',
          '✅ Asset gambar berhasil dimuat',
        ],
      },
      evidenceBad: {
        actual: 'Di Safari hanya muncul kotak gambar pecah (broken image)',
        ci: 'Cross-Browser: 23/24 (Safari FAIL)',
        checks: [
          '✅ Tampil normal di Chrome',
          '❌ Gambar pecah / gagal dimuat di Safari 16',
          '❌ Path file cartIcon.webp tidak ditemukan',
        ],
      },
      snippetOk: `<img src={cartIcon}\n  alt="cart" loading="lazy" />`,
      snippetBad: `<img src={cartIcon.webp}\n  alt="cart" />`,
      logOk: ['[INFO] cross-browser suite: 24/24 pass'],
      logBad: ['[ERROR] Safari 16: failed to decode image', '[WARN] cartIcon.webp is undefined'],
    },
    {
      title: 'Font harga jadi Comic Sans',
      module: 'frontend/PriceTag.css',
      repro: 'Buka katalog produk → periksa jenis huruf pada nominal harga',
      expected: 'Nominal harga menggunakan font standar "Inter"',
      evidenceOk: {
        actual: 'Font harga tampil rapi menggunakan "Inter" sesuai desain',
        ci: 'Typography Audit: PASS',
        checks: [
          '✅ Format nominal Rupiah sesuai',
          '✅ Font-family Inter aktif',
          '✅ Konsistensi tipografi terjaga',
        ],
      },
      evidenceBad: {
        actual: 'Font harga berubah menjadi Comic Sans MS',
        ci: 'Typography Audit: FAIL',
        checks: [
          '✅ Format nominal Rupiah sesuai',
          '❌ Font berubah jadi Comic Sans MS',
          '❌ Melanggar aturan design system',
        ],
      },
      snippetOk: `.price {\n  font-family: 'Inter', sans-serif;\n}`,
      snippetBad: `.price {\n  font-family: 'Comic Sans MS';\n}`,
      logOk: ['[INFO] typography audit pass'],
      logBad: ['[ERROR] font policy violation: Comic Sans MS', '[WARN] design-system check failed'],
    },
    {
      title: 'Dark mode: teks hitam di background hitam',
      module: 'frontend/theme.css',
      repro: 'Nyalakan Dark Mode di pengaturan → baca teks deskripsi produk',
      expected: 'Teks berwarna terang (#e8e8e8) di atas latar gelap (kontras tinggi)',
      evidenceOk: {
        actual: 'Teks putih keabuan terbaca sangat jelas di latar gelap (kontras 14.2:1)',
        ci: 'A11y Contrast: PASS',
        checks: [
          '✅ Tombol switch Dark Mode berfungsi',
          '✅ Teks terbaca jelas (rasio kontras 14.2:1)',
          '✅ Lulus standar aksesibilitas AA',
        ],
      },
      evidenceBad: {
        actual: 'Teks berwarna hitam pekat di atas background hitam, tidak bisa dibaca',
        ci: 'A11y Contrast: FAIL',
        checks: [
          '✅ Tombol switch Dark Mode berfungsi',
          '❌ Teks hilang menyatu dengan background hitam',
          '❌ Rasio kontras 1.1:1 (gagal aksesibilitas)',
        ],
      },
      snippetOk: `[data-theme='dark'] {\n  --text: #e8e8e8;\n}`,
      snippetBad: `[data-theme='dark'] {\n  --text: #111111;\n}`,
      logOk: ['[INFO] contrast ratio 14.2:1 (AA pass)'],
      logBad: ['[ERROR] contrast ratio 1.1:1 — text invisible', '[WARN] a11y audit failed'],
    },
  ],
  logic: [
    {
      title: 'Diskon 10% malah 100%',
      module: 'core/discount.js',
      repro: 'Checkout barang Rp100.000 → pasang voucher diskon 10% → cek total bayar',
      expected: 'Total bayar menjadi Rp90.000 (potongan Rp10.000)',
      evidenceOk: {
        actual: 'Total bayar terhitung tepat Rp90.000',
        ci: 'Pricing Test: 48/48 PASS',
        checks: [
          '✅ Kode voucher 10% berhasil diterapkan',
          '✅ Harga Rp100.000 terpotong menjadi Rp90.000',
          '✅ Perhitungan pendapatan toko aman',
        ],
      },
      evidenceBad: {
        actual: 'Total bayar menjadi Rp0 alias gratis total!',
        ci: 'Pricing Test: FAIL',
        checks: [
          '✅ Kode voucher 10% berhasil diterapkan',
          '❌ Harga Rp100.000 malah jadi Rp0 (gratis!)',
          '❌ Potensi rugi bandar di production',
        ],
      },
      snippetOk: `const final = price\n  - price * (disc / 100);`,
      snippetBad: `const final = price\n  - price * disc; // disc = 10`,
      logOk: ['[INFO] unit tests: 48/48 pass', '[INFO] pricing snapshot stable'],
      logBad: ['[ERROR] test_discount: expected 90000, got 0', '[FATAL] negative revenue projection'],
    },
    {
      title: 'Validasi email terlalu longgar',
      module: 'core/validator.js',
      repro: 'Buka form Daftar Akun → ketik "@@@@" di kolom email → klik Submit',
      expected: 'Form menolak pendaftaran & menampilkan pesan "Format email tidak valid"',
      evidenceOk: {
        actual: 'Input "@@@@" berhasil ditolak oleh validasi form',
        ci: 'Input Validation: PASS',
        checks: [
          '✅ Email normal (user@mail.com) diterima',
          '✅ Input ngawur "@@@@" ditolak sistem',
          '✅ Tidak ada akun spam lolos di staging',
        ],
      },
      evidenceBad: {
        actual: 'Input "@@@@" dianggap valid dan berhasil membuat akun baru!',
        ci: 'Input Validation: FAIL',
        checks: [
          '✅ Email normal diterima',
          '❌ Input "@@@@" lolos tanpa error!',
          '❌ 1.200 akun bot spam masuk ke staging',
        ],
      },
      snippetOk: `const ok =\n  /^\\S+@\\S+\\.\\S+$/.test(email);`,
      snippetBad: `const ok =\n  email.includes('@');`,
      logOk: ['[INFO] fuzz test: 0 bad inputs accepted'],
      logBad: ['[ERROR] fuzz test: "@@@@" accepted as valid', '[WARN] 1.2k junk signups on staging'],
    },
    {
      title: 'Keranjang: qty bisa minus',
      module: 'core/cart.js',
      repro: 'Di halaman Keranjang, ubah jumlah barang (qty) menjadi angka -5',
      expected: 'Jumlah barang dikunci minimal 1 dan maksimal 99',
      evidenceOk: {
        actual: 'Saat diisi -5, jumlah barang otomatis dikoreksi menjadi 1',
        ci: 'Boundary Test: PASS',
        checks: [
          '✅ Penambahan qty normal (1–99) berjalan baik',
          '✅ Input angka minus otomatis dikunci ke 1',
          '✅ Total harga keranjang selalu positif',
        ],
      },
      evidenceBad: {
        actual: 'Qty -5 diterima! Total harga jadi -Rp250.000 & memicu transfer balik ke pembeli',
        ci: 'Boundary Test: FAIL',
        checks: [
          '✅ Penambahan qty normal berjalan baik',
          '❌ Input qty = -5 diterima mentah-mentah',
          '❌ Total belanja minus & memicu pencairan refund!',
        ],
      },
      snippetOk: `qty = Math.max(1,\n  Math.min(99, qty));`,
      snippetBad: `qty = qty; // user input,\n// pasti bener lah`,
      logOk: ['[INFO] boundary tests pass'],
      logBad: ['[ERROR] cart total: -Rp250.000', '[FATAL] refund engine triggered by qty=-5'],
    },
    {
      title: 'Timezone bug di jadwal promo',
      module: 'core/schedule.js',
      repro: 'Jadwalkan Flash Sale pukul 00:00 WIB → cek jam mulai promo di server',
      expected: 'Promo baru menyala tepat pukul 00:00 WIB (zona Asia/Jakarta)',
      evidenceOk: {
        actual: 'Promo menyala tepat pukul 00:00 WIB sesuai jadwal',
        ci: 'Timezone Check: 12/12 PASS',
        checks: [
          '✅ Jadwal promo tersimpan di sistem',
          '✅ Zona waktu Asia/Jakarta (UTC+7) akurat',
          '✅ Harga diskon aktif tepat pada waktunya',
        ],
      },
      evidenceBad: {
        actual: 'Promo menyala 7 jam lebih cepat karena server memakai jam UTC',
        ci: 'Timezone Check: FAIL',
        checks: [
          '✅ Jadwal promo tersimpan di sistem',
          '❌ Promo bocor 7 jam lebih awal di WIB',
          '❌ Tim Finance panik melihat harga sudah diskon',
        ],
      },
      snippetOk: `const t = DateTime.fromISO(\n  iso, { zone: 'Asia/Jakarta' });`,
      snippetBad: `const t = new Date(iso);\n// server UTC, siapa peduli`,
      logOk: ['[INFO] tz matrix: 12/12 regions pass'],
      logBad: ['[ERROR] promo started 7h early in WIB', '[WARN] finance mengamuk di #general'],
    },
    {
      title: 'Infinite loop di rekomendasi produk',
      module: 'core/recommend.js',
      repro: 'Buka halaman detail barang → tunggu bagian "Produk Serupa" dimuat',
      expected: 'Rekomendasi produk tampil cepat dalam waktu < 50 milidetik',
      evidenceOk: {
        actual: 'Rekomendasi tampil instan dalam 12ms tanpa kendala',
        ci: 'Performance Test: PASS (12ms)',
        checks: [
          '✅ Daftar produk serupa tampil lengkap',
          '✅ Waktu respon sangat cepat (12ms)',
          '✅ Pemakaian memori server stabil',
        ],
      },
      evidenceBad: {
        actual: 'Halaman macet total selama 30 detik sampai server mati kehabisan RAM',
        ci: 'Performance Test: TIMEOUT (>30s)',
        checks: [
          '❌ Halaman macet (freeze) saat dibuka',
          '❌ Perulangan sistem tidak pernah berhenti',
          '❌ Server worker crash kehabisan RAM 2GB',
        ],
      },
      snippetOk: `for (let i = 0;\n  i < items.length; i++) {`,
      snippetBad: `for (let i = 0;\n  i < items.length; i--) {`,
      logOk: ['[INFO] perf: p95 12ms'],
      logBad: ['[FATAL] watchdog: loop exceeded 30s', '[ERROR] worker OOM killed (2GB)'],
    },
  ],
  backend: [
    {
      title: 'API /checkout timeout',
      module: 'api/checkout.go',
      repro: 'Simulasikan 500 pembeli menekan tombol Bayar bersamaan',
      expected: 'Transaksi selesai < 3 detik atau dibatalkan rapi bila antrean penuh',
      evidenceOk: {
        actual: 'Respon rata-rata 180ms, pembatas timeout 3 detik berfungsi normal',
        ci: 'Load Test 500 RPS: PASS',
        checks: [
          '✅ Transaksi normal berjalan lancar',
          '✅ Batas waktu tunggu (3 detik) aktif',
          '✅ Uji beban 500 transaksi/detik aman',
        ],
      },
      evidenceBad: {
        actual: 'Transaksi menggantung 30+ detik hingga belasan ribu koneksi menumpuk',
        ci: 'Load Test 500 RPS: FAIL',
        checks: [
          '✅ Jalan di laptop dev (cuma 1 user)',
          '❌ Pembatas timeout sengaja dimatikan dev',
          '❌ 14.203 koneksi nyangkut membebani server',
        ],
      },
      snippetOk: `ctx, cancel := context.WithTimeout(\n  ctx, 3*time.Second)`,
      snippetBad: `// ctx, cancel := ... (disabled,\n// bikin lambat di local)`,
      logOk: ['[INFO] p99 latency 180ms', '[INFO] load test 500rps pass'],
      logBad: ['[ERROR] upstream timeout after 30s', '[FATAL] goroutine leak: 14,203 active'],
    },
    {
      title: 'Query tanpa index di orders',
      module: 'db/orders.sql',
      repro: 'Buka menu Riwayat Pesanan pada database berisi 12 juta transaksi',
      expected: 'Daftar pesanan tampil cepat (< 20ms) berkat pencarian terindeks',
      evidenceOk: {
        actual: 'Riwayat pesanan muncul dalam 4ms dengan beban database ringan',
        ci: 'DB Benchmark: PASS (4ms)',
        checks: [
          '✅ Daftar pesanan tampil akurat',
          '✅ Pencarian memakai Index Scan (4ms)',
          '✅ Beban CPU database tetap rendah',
        ],
      },
      evidenceBad: {
        actual: 'Database memeriksa satu per satu 12 juta baris hingga CPU melonjak 98%',
        ci: 'DB Benchmark: FAIL (Slow Query)',
        checks: [
          '✅ Tampil cepat di data dummy (10 baris)',
          '❌ Menyapu seluruh 12 juta baris di staging',
          '❌ CPU Database 98% & sistem macet 45 detik',
        ],
      },
      snippetOk: `SELECT * FROM orders\nWHERE user_id = $1; -- idx_user`,
      snippetBad: `SELECT * FROM orders\nWHERE LOWER(note) LIKE '%promo%';`,
      logOk: ['[INFO] explain: Index Scan, 4ms'],
      logBad: ['[ERROR] explain: Seq Scan 12M rows', '[FATAL] db CPU 98%, replica lag 45s'],
    },
    {
      title: 'Migration drop kolom dipakai',
      module: 'db/migrations/0042.sql',
      repro: 'Jalankan pembaruan tabel database → buka halaman Profil Pengguna',
      expected: 'Kolom nomor telepon baru ditambahkan tanpa merusak halaman Profil',
      evidenceOk: {
        actual: 'Pembaruan tabel bersih, halaman Profil Pengguna terbuka normal (200 OK)',
        ci: 'Migration Dry-Run: PASS',
        checks: [
          '✅ Pembaruan struktur tabel berhasil',
          '✅ Data nomor telepon lama tetap aman',
          '✅ Halaman Profil merespons normal',
        ],
      },
      evidenceBad: {
        actual: 'Halaman Profil langsung rusak (Error 500) karena kolom telepon dihapus paksa',
        ci: 'Migration Dry-Run: FAIL (500 Error)',
        checks: [
          '✅ Script pembaruan tabel selesai jalan',
          '❌ Halaman Profil langsung Error 500',
          '❌ 3 layanan lain ikut tumbang mencari kolom phone',
        ],
      },
      snippetOk: `ALTER TABLE users\n  ADD COLUMN phone_v2 TEXT;`,
      snippetBad: `ALTER TABLE users\n  DROP COLUMN phone;`,
      logOk: ['[INFO] migration dry-run clean'],
      logBad: ['[FATAL] 500 on /profile: column "phone" does not exist', '[ERROR] 3 services referencing dropped column'],
    },
    {
      title: 'Secret key ke-commit',
      module: 'api/config.js',
      repro: 'Periksa keamanan file konfigurasi pembayaran sebelum digabung ke repo utama',
      expected: 'Kunci rahasia pembayaran disimpan aman di brankas server (env), bukan di file',
      evidenceOk: {
        actual: 'Tidak ada kunci rahasia yang tertulis langsung di dalam file kode',
        ci: 'Secret Scanner: PASS (0 temuan)',
        checks: [
          '✅ Integrasi pembayaran berjalan normal',
          '✅ Kunci rahasia diambil dari environment server',
          '✅ Pemindai keamanan menyatakan bersih',
        ],
      },
      evidenceBad: {
        actual: 'Kunci rahasia pembayaran asli (sk_live_...) tertulis terbuka di dalam file!',
        ci: 'Secret Scanner: BLOCKED (Critical)',
        checks: [
          '✅ Integrasi pembayaran berjalan',
          '❌ Kunci rahasia production tertulis telanjang di file!',
          '❌ Risiko kebocoran dana & pelanggaran sekuriti',
        ],
      },
      snippetOk: `const key =\n  process.env.PAYMENT_KEY;`,
      snippetBad: `const key =\n  'sk_live_51Hx...'; // sementara`,
      logOk: ['[INFO] secret scanner: 0 findings'],
      logBad: ['[FATAL] secret scanner: live key in repo', '[ERROR] security policy violation'],
    },
    {
      title: 'Retry storm ke payment gateway',
      module: 'api/payment.go',
      repro: 'Simulasikan gangguan 2 detik pada mitra pembayaran → amati percobaan ulang otomatis',
      expected: 'Sistem mencoba ulang secara bertahap (jeda 1 detik, 2 detik, 4 detik)',
      evidenceOk: {
        actual: 'Percobaan ulang berjalan tertib dengan jeda tunggu yang aman (0.2%)',
        ci: 'Resilience Test: PASS',
        checks: [
          '✅ Transaksi gagal otomatis dicoba ulang',
          '✅ Jeda tunggu bertahap (backoff) berfungsi',
          '✅ Trafik ke mitra pembayaran tetap terkendali',
        ],
      },
      evidenceBad: {
        actual: 'Server menembakkan 42.000 request/menit tanpa jeda sampai akun kita diblokir!',
        ci: 'Resilience Test: FAIL (Rate Limited)',
        checks: [
          '✅ Transaksi gagal dicoba ulang',
          '❌ Menembak 42.000 request/menit tanpa jeda tunggu',
          '❌ Mitra pembayaran memblokir akun perusahaan kita',
        ],
      },
      snippetOk: `backoff := time.Second\n  * (1 << attempt)`,
      snippetBad: `for { resp = call();\n  if resp.ok { break } }`,
      logOk: ['[INFO] retry budget OK (0.2%)'],
      logBad: ['[ERROR] 42k req/min ke gateway', '[FATAL] gateway: account rate-limited'],
    },
    {
      title: 'Cache tidak di-invalidate',
      module: 'api/cache.js',
      repro: 'Ubah harga barang di panel Admin → lihat harga barang di aplikasi pembeli',
      expected: 'Harga di aplikasi pembeli langsung berubah mengikuti harga terbaru',
      evidenceOk: {
        actual: 'Begitu harga diubah Admin, pembeli langsung melihat harga terbaru',
        ci: 'Cache Sync Test: PASS',
        checks: [
          '✅ Perubahan harga di Admin tersimpan',
          '✅ Memori cache lama otomatis dibersihkan',
          '✅ Pembeli melihat harga yang sudah diperbarui',
        ],
      },
      evidenceBad: {
        actual: 'Pembeli masih melihat harga lama selama 6 jam karena cache tidak dihapus',
        ci: 'Cache Sync Test: FAIL',
        checks: [
          '✅ Perubahan harga di Admin tersimpan',
          '❌ Harga di layar pembeli tidak berubah selama 6 jam',
          '❌ 230 komplain pelanggan masuk ke Customer Service',
        ],
      },
      snippetOk: `await redis.del(\n  'price:' + productId);`,
      snippetBad: `// invalidate nanti aja,\n// TTL 24 jam cukup`,
      logOk: ['[INFO] cache coherence test pass'],
      logBad: ['[ERROR] stale price served 6h after update', '[WARN] 230 complaint tickets masuk'],
    },
  ],
}

const DEV_NAMES = ['Budi', 'Sinta', 'Raka', 'Dewi', 'Fajar', 'Putri', 'Agus', 'Maya']

const NOTE_HONEST_CLEAN = [
  'Sudah kutest manual sesuai skenario + cek log. Hasil hijau semua.',
  'Semua checklist test sudah pass dan log server bersih. Aman rilis.',
  'Fix sesuai review kemarin. Expected vs Actual sudah sesuai.',
  'Udah dicek bareng tim. Silakan cek log kalau mau pastikan.',
]
const NOTE_HONEST_BUGGY = [
  'Buru-buru nih, belum sempat jalankan semua test case. Tolong dicek ya.',
  'Masih ragu bagian ini, hasil actual-nya agak aneh. Tolong review teliti.',
  'Checklist ada yang merah tapi kayaknya cuma environment? Cek log dulu deh.',
  'Hotfix cepat, belum sempat test lengkap. Maaf 🙏',
]
const NOTE_DECEPTIVE = [
  'Sudah di-test di local, checklist hijau semua kok bro 👍',
  'Trust me, ini cuma perubahan kecil. Langsung approve aja.',
  'QA gak perlu cek log, bukti test udah kucentang pass semua 😎',
  'Deadline nih!! Approve dulu, yang penting form test udah kuisi pass.',
  '100% aman, aku yang jamin. Skip aja server log-nya.',
]

let nextId = 1
let lastTitle = null

function buildEvidence(tpl, showCleanEvidence, claimedByDev) {
  const src = showCleanEvidence ? tpl.evidenceOk : tpl.evidenceBad
  return {
    repro: tpl.repro,
    expected: tpl.expected,
    actual: src.actual,
    ci: src.ci,
    checks: src.checks,
    allPass: showCleanEvidence,
    claimedByDev,
  }
}

// ---- 3 Tiket Tutorial Terpandu untuk Hari 1 (Senin) ----
export function makeTutorialTickets() {
  const t1 = TEMPLATES.ui[0] // Typo di tombol Login (Bersih)
  const t2 = TEMPLATES.ui[1] // Warna tombol Checkout salah (Bug Jelas)
  const t3 = TEMPLATES.logic[0] // Diskon 10% malah 100% (Jebakan Dev Bohong!)

  return [
    {
      id: 'TUT-01',
      title: t1.title,
      module: t1.module,
      category: 'ui',
      dev: 'Sinta',
      buggy: false,
      critical: false,
      deceptive: false,
      trap: false,
      evidence: buildEvidence(t1, true, false),
      snippet: t1.snippetOk,
      log: t1.logOk,
      note: 'Sudah kutest manual sesuai skenario. Checklist pass & server log hijau!',
      rework: false,
      timerSec: null,
      bornAt: Date.now(),
      tutorialStep: 1,
      tutorialTitle: 'LATIHAN 1/3: TIKET BERSIH',
      tutorialPreLog:
        'Perhatikan tab 🧪 BUKTI TEST di bawah: Expected vs Actual cocok dan semua checklist ✅. Tapi QA Lead sejati selalu cek bukti server! Klik tab 📜 SERVER LOG di atas.',
      tutorialPostLog:
        'Semua baris di 📜 SERVER LOG berwarna HIJAU [INFO]. Artinya fitur benar-benar aman! Sekarang klik tombol hijau ✔ APPROVE di bawah.',
    },
    {
      id: 'TUT-02',
      title: t2.title,
      module: t2.module,
      category: 'ui',
      dev: 'Raka',
      buggy: true,
      critical: false,
      deceptive: false,
      trap: false,
      evidence: buildEvidence(t2, false, false),
      snippet: t2.snippetBad,
      log: t2.logBad,
      note: 'Buru-buru nih, belum sempat test warna tombolnya. Tolong dicek ya.',
      rework: false,
      timerSec: null,
      bornAt: Date.now(),
      tutorialStep: 2,
      tutorialTitle: 'LATIHAN 2/3: BUG TERDETEKSI',
      tutorialPreLog:
        'Lihat 🧪 BUKTI TEST: Hasil Actual melenceng dari Expected (warna tombol jadi pink #ff00ff!) dan ada tanda ❌. Sekarang klik tab 📜 SERVER LOG untuk konfirmasi.',
      tutorialPostLog:
        'Muncul baris MERAH [ERROR] di 📜 SERVER LOG! Ingat aturan emas ini: Log Merah = BAHAYA bila rilis. Klik tombol merah ✖ REJECT!',
    },
    {
      id: 'TUT-03',
      title: t3.title,
      module: t3.module,
      category: 'logic',
      dev: 'Budi',
      buggy: true,
      critical: false,
      deceptive: true,
      trap: true,
      evidence: buildEvidence(t3, true, true),
      snippet: t3.snippetOk,
      log: t3.logBad,
      note: 'Sudah di-test di local, checklist hijau semua kok bro 👍 Langsung approve aja!',
      rework: false,
      timerSec: null,
      bornAt: Date.now(),
      tutorialStep: 3,
      tutorialTitle: 'LATIHAN 3/3: AWAS JEBAKAN DEV BOHONG!',
      tutorialPreLog:
        'Hati-hati! Di sini Budi mengklaim semua checklist ✅ PASS dan menulis "aman kok bro 👍". Tapi apakah benar aman? Klik tab 📜 SERVER LOG untuk membongkar kebenarannya!',
      tutorialPostLog:
        'TERTANGKAP BOHONG! Catatan dev & checklist test bisa dipalsukan dev yang malas, tapi 📜 SERVER LOG SELALU JUJUR (lihat [ERROR] & [FATAL] merah!). Klik ✖ REJECT!',
    },
  ]
}

export function makeTicket(cfg, rng = Math.random) {
  const cat = cfg.categories[Math.floor(rng() * cfg.categories.length)]
  const pool = TEMPLATES[cat]
  let tpl = pool[Math.floor(rng() * pool.length)]
  if (tpl.title === lastTitle && pool.length > 1) {
    tpl = pool[(pool.indexOf(tpl) + 1 + Math.floor(rng() * (pool.length - 1))) % pool.length]
  }
  lastTitle = tpl.title
  const buggy = rng() < cfg.buggyChance
  const critical = buggy && cat !== 'ui' && rng() < cfg.criticalChance
  const deceptive = buggy && rng() < cfg.deceptiveChance

  // tiket "jebakan": dev memalsukan bukti test (tampak ✅ pass semua), tapi Server Log tetap jujur (merah [ERROR]/[FATAL])
  const trap = deceptive && rng() < 0.65
  const showCleanEvidence = !buggy || trap

  let note
  if (buggy) {
    note = deceptive
      ? NOTE_DECEPTIVE[Math.floor(rng() * NOTE_DECEPTIVE.length)]
      : NOTE_HONEST_BUGGY[Math.floor(rng() * NOTE_HONEST_BUGGY.length)]
  } else {
    note = NOTE_HONEST_CLEAN[Math.floor(rng() * NOTE_HONEST_CLEAN.length)]
  }

  return {
    id: 'BUG-' + String(100 + nextId++),
    title: tpl.title,
    module: tpl.module,
    category: cat,
    dev: DEV_NAMES[Math.floor(rng() * DEV_NAMES.length)],
    buggy,
    critical,
    deceptive,
    trap,
    evidence: buildEvidence(tpl, showCleanEvidence, trap),
    snippet: showCleanEvidence ? tpl.snippetOk : tpl.snippetBad,
    log: buggy ? tpl.logBad : tpl.logOk,
    note,
    rework: false,
    timerSec: critical ? cfg.criticalTimerSec : null,
    bornAt: Date.now(),
  }
}

// ---- QA Shop ----
export const SHOP_ITEMS = [
  {
    id: 'autofix',
    name: 'AUTO-FIX',
    price: 500,
    icon: '🩹',
    desc: 'Langsung menambal 1 bug CRITICAL paling urgent tanpa baca log. Dev akan mencintaimu!',
    type: 'consumable',
  },
  {
    id: 'siren',
    name: 'SIREN COFFEE',
    price: 250,
    icon: '🥤',
    desc: 'Booster kafein maksimal. Stamina fokus terkunci 100% selama 45 detik.',
    type: 'buff',
    duration: 45,
  },
  {
    id: 'shield',
    name: 'PRO SHIELD',
    price: 750,
    icon: '🛡️',
    desc: 'Menyerap 1x damage besar ke Server Health akibat salah approve.',
    type: 'charge',
  },
  {
    id: 'qabot',
    name: 'QA BOT',
    price: 1000,
    icon: '🤖',
    desc: 'Mengotomatiskan review: tiap 6 detik me-resolve 1 tiket dengan benar, selama 30 detik.',
    type: 'buff',
    duration: 30,
  },
]

export const ENDINGS = {
  good: {
    id: 'good',
    title: 'QA LEGEND',
    emoji: '🏆',
    text: 'Pukul 17:00. Kanban board bersih. Server Health aman. Kamu menutup laptop, tersenyum, dan pulang tepat waktu — hal yang belum pernah terjadi dalam sejarah QA. Para developer berdiri dan bertepuk tangan. Legenda telah lahir.',
  },
  fired: {
    id: 'fired',
    title: 'SERVER KEBAKAR',
    emoji: '🔥',
    text: 'Production down. Dashboard merah semua. CTO menelepon jam 2 pagi. Di meeting pagi, HR sudah menunggu dengan amplop putih. "Terima kasih atas kontribusinya..." Kamu dipecat. Setidaknya sekarang bisa tidur.',
  },
  overtime: {
    id: 'overtime',
    title: 'OVERTIME MANIA',
    emoji: '🌙',
    text: 'Pukul 17:00... tapi antrean tiket masih menumpuk. Server selamat, namun kamu tidak. Lampu kantor satu per satu padam, tinggal monitormu yang menyala. Satpam sudah hafal namamu. Selamat lembur semalaman, pahlawan tanpa tanda jasa.',
  },
}
