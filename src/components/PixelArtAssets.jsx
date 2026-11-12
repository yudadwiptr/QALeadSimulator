// Kumpulan ilustrasi Pixel Art SVG (shapeRendering="crispEdges") sesuai gambar referensi 1, 2, dan 4.

function P({ x, y, w = 1, h = 1, c }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} />
}

// ============================================================================
// 1. AVATAR DEVELOPER PIXEL ART (Untuk Kartu Jira & Chat COMMS)
// ============================================================================
const DEV_PALETTES = {
  Budi: { skin: '#d99b72', hair: '#241816', shirt: '#dc2626', glasses: false },
  Sinta: { skin: '#f0b894', hair: '#4a2511', shirt: '#2563eb', glasses: true },
  Raka: { skin: '#c68459', hair: '#18181b', shirt: '#16a34a', glasses: false },
  Dewi: { skin: '#eab08c', hair: '#7c2d12', shirt: '#9333ea', glasses: true },
  Fajar: { skin: '#d19066', hair: '#3b2824', shirt: '#d97706', glasses: true },
  Putri: { skin: '#f2bfa0', hair: '#1e1b4b', shirt: '#db2777', glasses: false },
  Agus: { skin: '#bd7b52', hair: '#27272a', shirt: '#0d9488', glasses: false },
  Maya: { skin: '#eba882', hair: '#581c87', shirt: '#4f46e5', glasses: true },
}

export function DevAvatar({ name = 'Budi', size = 24 }) {
  const pal = DEV_PALETTES[name] || DEV_PALETTES.Budi
  const out = '#141019'
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Outline Kepala */}
      <P x={3} y={2} w={10} h={10} c={out} />
      {/* Rambut */}
      <P x={3} y={2} w={10} h={4} c={pal.hair} />
      <P x={3} y={5} w={2} h={3} c={pal.hair} />
      <P x={11} y={5} w={2} h={3} c={pal.hair} />
      {/* Wajah */}
      <P x={4} y={5} w={8} h={6} c={pal.skin} />
      {/* Mata / Kacamata */}
      {pal.glasses ? (
        <>
          <P x={4} y={6} w={3} h={2} c="#1e293b" />
          <P x={9} y={6} w={3} h={2} c="#1e293b" />
          <P x={5} y={6} w={2} h={1} c="#93e5ff" />
          <P x={10} y={6} w={2} h={1} c="#93e5ff" />
          <P x={7} y={6} w={2} h={1} c="#1e293b" />
        </>
      ) : (
        <>
          <P x={5} y={7} w={2} h={1} c={out} />
          <P x={9} y={7} w={2} h={1} c={out} />
        </>
      )}
      {/* Mulut */}
      <P x={6} y={9} w={4} h={1} c="#7a4434" />
      {/* Bahu / Baju */}
      <P x={2} y={12} w={12} h={4} c={out} />
      <P x={3} y={12} w={10} h={3} c={pal.shirt} />
    </svg>
  )
}

// ============================================================================
// 2. ILUSTRASI 4 ITEM QA SHOP (Sesuai Referensi 4.jfif)
// ============================================================================
export function ShopItemArt({ id, size = 84 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{
        display: 'block',
        filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.35))',
      }}
    >
      {id === 'autofix' && (
        <g>
          {/* Window Browser di Belakang */}
          <P x={3} y={5} w={24} h={19} c="#0f172a" />
          <P x={4} y={6} w={22} h={3} c="#1e3a8a" />
          <P x={5} y={7} w={2} h={1} c="#ef4444" />
          <P x={8} y={7} w={2} h={1} c="#f59e0b" />
          <P x={11} y={7} w={2} h={1} c="#22c55e" />
          <P x={3} y={5} w={24} h={1} c="#38bdf8" />
          <P x={3} y={5} w={1} h={19} c="#38bdf8" />
          <P x={26} y={5} w={1} h={19} c="#38bdf8" />
          <P x={3} y={23} w={10} h={1} c="#38bdf8" />

          {/* Plester Band-Aid Hijau Neon Melintang */}
          <P x={6} y={16} w={6} h={6} c="#22c55e" />
          <P x={9} y={13} w={6} h={6} c="#4ade80" />
          <P x={12} y={10} w={7} h={7} c="#bbf7d0" />
          <P x={16} y={8} w={6} h={6} c="#4ade80" />
          <P x={19} y={6} w={6} h={6} c="#22c55e" />
          {/* Titik-titik pori plester */}
          <P x={8} y={18} w={1} h={1} c="#15803d" />
          <P x={10} y={16} w={1} h={1} c="#15803d" />
          <P x={20} y={8} w={1} h={1} c="#15803d" />
          <P x={22} y={10} w={1} h={1} c="#15803d" />

          {/* Simbol </> di Kanan Bawah */}
          <P x={17} y={24} w={2} h={1} c="#4ade80" />
          <P x={16} y={25} w={2} h={1} c="#4ade80" />
          <P x={17} y={26} w={2} h={1} c="#4ade80" />
          <P x={21} y={23} w={1} h={5} c="#4ade80" />
          <P x={24} y={24} w={2} h={1} c="#4ade80" />
          <P x={25} y={25} w={2} h={1} c="#4ade80" />
          <P x={24} y={26} w={2} h={1} c="#4ade80" />
        </g>
      )}

      {id === 'siren' && (
        <g>
          {/* Pancaran Sinar Sirine */}
          <P x={8} y={4} w={2} h={1} c="#ef4444" />
          <P x={22} y={4} w={2} h={1} c="#ef4444" />
          <P x={9} y={2} w={2} h={1} c="#f97316" />
          <P x={21} y={2} w={2} h={1} c="#f97316" />

          {/* Lampu Sirine Merah di Atas Tutup Kopi */}
          <P x={13} y={3} w={6} h={6} c="#991b1b" />
          <P x={14} y={4} w={4} h={5} c="#ef4444" />
          <P x={15} y={5} w={2} h={3} c="#fef08a" />
          <P x={12} y={8} w={8} h={2} c="#1e293b" />

          {/* Tutup Cup Hijau */}
          <P x={8} y={10} w={16} h={3} c="#16a34a" />
          <P x={9} y={10} w={14} h={1} c="#4ade80" />

          {/* Badan Cup Merah & Sleeve Hijau */}
          <P x={9} y={13} w={14} h={15} c="#dc2626" />
          <P x={10} y={13} w={3} h={15} c="#f87171" />
          <P x={9} y={17} w={14} h={6} c="#16a34a" />
          <P x={14} y={18} w={4} h={4} c="#14532d" />
          <P x={15} y={19} w={2} h={2} c="#4ade80" />
          <P x={10} y={28} w={12} h={2} c="#991b1b" />
        </g>
      )}

      {id === 'shield' && (
        <g>
          {/* Server Rack di Belakang */}
          <P x={14} y={4} w={11} h={18} c="#1e293b" />
          <P x={15} y={5} w={9} h={16} c="#334155" />
          <P x={16} y={7} w={5} h={1} c="#38bdf8" />
          <P x={22} y={7} w={1} h={1} c="#4ade80" />
          <P x={16} y={10} w={5} h={1} c="#38bdf8" />
          <P x={22} y={10} w={1} h={1} c="#4ade80" />

          {/* Perisai Biru Bersinar di Depan */}
          <P x={6} y={8} w={12} h={13} c="#0284c7" />
          <P x={7} y={9} w={10} h={10} c="#38bdf8" />
          <P x={8} y={10} w={4} h={8} c="#bae6fd" />
          <P x={9} y={21} w={6} h={3} c="#0284c7" />
          <P x={10} y={21} w={4} h={2} c="#38bdf8" />
          <P x={11} y={24} w={2} h={2} c="#0284c7" />

          {/* Tembok Firewall Bata Neon Ungu/Pink */}
          <P x={3} y={20} w={8} h={8} c="#a21caf" />
          <P x={4} y={21} w={3} h={2} c="#e879f9" />
          <P x={8} y={21} w={2} h={2} c="#e879f9" />
          <P x={4} y={24} w={2} h={2} c="#e879f9" />
          <P x={7} y={24} w={3} h={2} c="#e879f9" />

          <P x={19} y={20} w={9} h={8} c="#a21caf" />
          <P x={20} y={21} w={3} h={2} c="#e879f9" />
          <P x={24} y={21} w={3} h={2} c="#e879f9" />
          <P x={20} y={24} w={4} h={2} c="#e879f9" />
          <P x={25} y={24} w={2} h={2} c="#e879f9" />
        </g>
      )}

      {id === 'qabot' && (
        <g>
          {/* Antena Merah Menyala */}
          <P x={14} y={2} w={2} h={2} c="#ef4444" />
          <P x={14} y={4} w={2} h={3} c="#94a3b8" />

          {/* Kepala Robot */}
          <P x={8} y={7} w={14} h={10} c="#cbd5e1" />
          <P x={9} y={8} w={12} h={8} c="#1e293b" />
          {/* Mata Merah Menyala & Senyum */}
          <P x={11} y={10} w={2} h={2} c="#ef4444" />
          <P x={17} y={10} w={2} h={2} c="#ef4444" />
          <P x={13} y={13} w={4} h={1} c="#f87171" />

          {/* Badan Robot */}
          <P x={10} y={18} w={10} h={7} c="#94a3b8" />
          <P x={12} y={19} w={6} h={4} c="#1e293b" />
          <P x={13} y={20} w={4} h={2} c="#ef4444" />

          {/* Tangan & Kaki */}
          <P x={6} y={19} w={4} h={3} c="#64748b" />
          <P x={20} y={19} w={4} h={3} c="#64748b" />
          <P x={10} y={25} w={4} h={4} c="#64748b" />
          <P x={16} y={25} w={4} h={4} c="#64748b" />

          {/* Kaca Pembesar QA di Tangan Kanan */}
          <P x={23} y={12} w={6} h={6} c="#e2e8f0" />
          <P x={24} y={13} w={4} h={4} c="#38bdf8" />
          <P x={24} y={13} w={2} h={1} c="#ffffff" />
          <P x={24} y={18} w={2} h={4} c="#94a3b8" />
        </g>
      )}
    </svg>
  )
}

// ============================================================================
// 3. PROPERTI MEJA KERJA (Kukis, Keyboard, Mouse, Gelas Kopi) Sesuai 2.jfif
// ============================================================================
export function DeskCookie() {
  return (
    <svg viewBox="0 0 24 16" width={54} height={36} shapeRendering="crispEdges">
      <P x={3} y={5} w={16} h={9} c="#1c1208" />
      <P x={4} y={4} w={13} h={9} c="#c88a4b" />
      <P x={5} y={5} w={10} h={6} c="#dfa263" />
      {/* Bekas gigitan di kanan atas */}
      <P x={15} y={3} w={4} h={4} c="#241a12" />
      {/* Choco chips */}
      <P x={6} y={6} w={2} h={2} c="#3d2314" />
      <P x={11} y={5} w={2} h={2} c="#3d2314" />
      <P x={9} y={9} w={2} h={2} c="#3d2314" />
      <P x={14} y={8} w={2} h={2} c="#3d2314" />
      {/* Remahan kukis */}
      <P x={19} y={11} w={2} h={2} c="#c88a4b" />
      <P x={22} y={12} w={1} h={1} c="#dfa263" />
    </svg>
  )
}

export function DeskKeyboardAndMouse() {
  return (
    <div className="flex items-center gap-4">
      {/* Mechanical Keyboard */}
      <svg viewBox="0 0 68 20" width={210} height={54} shapeRendering="crispEdges">
        <P x={1} y={2} w={66} h={17} c="#141010" />
        <P x={2} y={3} w={64} h={14} c="#b8b2a6" />
        <P x={3} y={4} w={62} h={11} c="#d6d1c4" />
        {/* Baris Tombol 1 */}
        {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((x) => (
          <P key={`r1-${x}`} x={x} y={5} w={3} h={2} c="#787166" />
        ))}
        {/* Baris Tombol 2 */}
        {[5, 11, 16, 21, 26, 31, 36, 41, 46, 51, 57].map((x) => (
          <P key={`r2-${x}`} x={x} y={8} w={4} h={2} c="#787166" />
        ))}
        {/* Baris Spasi */}
        <P x={5} y={11} w={6} h={2} c="#57524a" />
        <P x={13} y={11} w={5} h={2} c="#57524a" />
        <P x={20} y={11} w={24} h={2} c="#787166" />
        <P x={46} y={11} w={6} h={2} c="#57524a" />
        <P x={54} y={11} w={8} h={2} c="#c93028" />
      </svg>

      {/* Pixel Mouse */}
      <svg viewBox="0 0 18 20" width={46} height={50} shapeRendering="crispEdges">
        <P x={8} y={0} w={2} h={4} c="#141010" />
        <P x={3} y={4} w={12} h={14} c="#141010" />
        <P x={4} y={5} w={10} h={12} c="#cfc9bc" />
        <P x={8} y={5} w={2} h={4} c="#57524a" />
        <P x={4} y={9} w={10} h={1} c="#8c8578" />
      </svg>
    </div>
  )
}

// ============================================================================
// 4. PRATINJAU VISUAL MOCKUP (EXPECTED VS ACTUAL) DI TAB BUKTI TEST
// ============================================================================
export function VisualEvidencePreview({ ticket }) {
  const title = ticket.title || ''
  const isClean = Boolean(ticket.evidence?.allPass)

  const renderWidget = (cleanMode) => {
    // 1. Typo di tombol Login
    if (title.includes('Login')) {
      return (
        <div
          className="flex items-center justify-center py-2"
          style={{ background: '#0f172a', border: '1px solid #334155' }}
        >
          <span
            className="font-pixel px-4 py-1.5"
            style={{
              fontSize: 10,
              background: '#2563eb',
              color: '#ffffff',
              border: '2px solid #000',
            }}
          >
            {cleanMode ? 'Login' : 'Lgoin'}
          </span>
        </div>
      )
    }

    // 2. Warna tombol Checkout salah
    if (title.includes('Warna tombol Checkout')) {
      return (
        <div
          className="flex items-center justify-center py-2"
          style={{ background: '#0f172a', border: '1px solid #334155' }}
        >
          <span
            className="font-pixel px-3 py-1.5"
            style={{
              fontSize: 9,
              background: cleanMode ? '#2e9e41' : '#ff00ff',
              color: '#ffffff',
              border: '2px solid #000',
            }}
          >
            🛒 CHECKOUT
          </span>
        </div>
      )
    }

    // 3. Icon cart tidak muncul di Safari
    if (title.includes('Icon cart')) {
      return (
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ background: '#1e293b', border: '1px solid #334155', fontSize: 16 }}
        >
          <span style={{ color: '#94a3b8' }}>Safari 16 · TokoKu</span>
          {cleanMode ? (
            <span className="px-2 py-0.5" style={{ background: '#16a34a', color: '#fff' }}>
              🛒 (2)
            </span>
          ) : (
            <span className="px-2 py-0.5" style={{ background: '#7f1d1d', color: '#fca5a5' }}>
              [🖼️❌ broken.webp]
            </span>
          )}
        </div>
      )
    }

    // 4. Font harga jadi Comic Sans
    if (title.includes('Comic Sans')) {
      return (
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ background: '#0f172a', border: '1px solid #334155' }}
        >
          <span style={{ color: '#94a3b8', fontSize: 15 }}>Sepatu Lari:</span>
          <span
            style={{
              fontFamily: cleanMode ? 'monospace' : '"Comic Sans MS", cursive',
              fontSize: 18,
              color: cleanMode ? '#4ade80' : '#f472b6',
              fontWeight: 'bold',
              letterSpacing: cleanMode ? 0 : 2,
            }}
          >
            Rp 249.000
          </span>
        </div>
      )
    }

    // 5. Dark mode: teks hitam di background hitam
    if (title.includes('Dark mode')) {
      return (
        <div
          className="px-3 py-2 text-center"
          style={{
            background: '#0a0a0c',
            border: '1px solid #334155',
            color: cleanMode ? '#e8e8e8' : '#121215',
            fontSize: 16,
          }}
        >
          Deskripsi Produk Dark Mode
        </div>
      )
    }

    // 6. Diskon 10% malah 100%
    if (title.includes('Diskon 10%')) {
      return (
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ background: '#0f172a', border: '1px solid #334155', fontSize: 16 }}
        >
          <span style={{ color: '#94a3b8' }}>Harga Rp100rb (-10%):</span>
          <b style={{ color: cleanMode ? '#4ade80' : '#ff5c52' }}>
            {cleanMode ? 'Total: Rp 90.000' : 'Total: Rp 0 (GRATIS!)'}
          </b>
        </div>
      )
    }

    // 7. Keranjang: qty bisa minus
    if (title.includes('qty bisa minus')) {
      return (
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ background: '#0f172a', border: '1px solid #334155', fontSize: 16 }}
        >
          <span style={{ color: '#94a3b8' }}>Qty: {cleanMode ? '[ 1 ]' : '[ -5 ]'}</span>
          <b style={{ color: cleanMode ? '#4ade80' : '#ff5c52' }}>
            {cleanMode ? 'Rp 50.000' : '-Rp 250.000 (Refund!)'}
          </b>
        </div>
      )
    }

    // Default untuk tiket logic/backend lainnya: Mini Status Monitor
    return (
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: '#0f172a', border: '1px solid #334155', fontSize: 16 }}
      >
        <span style={{ color: '#94a3b8' }}>{ticket.module}</span>
        <span
          className="font-pixel"
          style={{ fontSize: 8, color: cleanMode ? '#4ade80' : '#ff5c52' }}
        >
          {cleanMode ? '🟢 STABLE (200 OK)' : '🔴 ANOMALY / FAIL'}
        </span>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 p-2"
      style={{ background: '#060a14', border: '2px solid #1e293b' }}
    >
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="font-pixel" style={{ fontSize: 7, color: '#38bdf8' }}>
            🖼️ EXPECTED (DESAIN/SPEK)
          </span>
        </div>
        {renderWidget(true)}
        <div style={{ fontSize: 15, color: '#cbd5e1', marginTop: 3 }}>
          {ticket.evidence?.expected}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span
            className="font-pixel"
            style={{ fontSize: 7, color: isClean ? '#4ade80' : '#ff5c52' }}
          >
            🔎 ACTUAL (HASIL DI LAYAR)
          </span>
          {ticket.trap && (
            <span className="font-pixel" style={{ fontSize: 6, color: '#fde047' }}>
              ✍️ KLAIM DEV
            </span>
          )}
        </div>
        {renderWidget(isClean)}
        <div
          style={{
            fontSize: 15,
            color: isClean ? '#bbf7d0' : '#fecaca',
            marginTop: 3,
          }}
        >
          {ticket.evidence?.actual}
        </div>
      </div>
    </div>
  )
}


