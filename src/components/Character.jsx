import { normalizeLook } from '../game/cosmetics.js'

// Helper untuk menggambar blok piksel (x, y, width, height, fill)
function P({ x, y, w = 1, h = 1, c }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} />
}

// ============================================================================
// LAYER KARAKTER UTAMA (Grid 48 x 62, Pixel Art Presisi Sesuai Referensi)
// ============================================================================

function BaseHeadAndLegs({ hasCoffee }) {
  const out = '#16111b' // outline hitam-coklat tua
  const skin = '#d7966b'
  const skinHi = '#e6ab82'
  const skinSh = '#b6754d'
  const skinDeep = '#8f5536'
  const brow = '#241816'
  const bag = '#7a4d57'
  const pants = '#2a334a'
  const pantsHi = '#3b4766'
  const pantsSh = '#1b2131'
  const shoe = '#1e161a'
  const shoeHi = '#382a30'

  return (
    <g>
      {/* ---- SEPATU & KAKI ---- */}
      {/* Kaki Kiri */}
      <P x={16} y={47} w={7} h={10} c={out} />
      <P x={17} y={47} w={5} h={9} c={pants} />
      <P x={18} y={48} w={2} h={7} c={pantsHi} />
      <P x={21} y={48} w={1} h={8} c={pantsSh} />
      {/* Sepatu Kiri */}
      <P x={14} y={56} w={9} h={4} c={out} />
      <P x={15} y={57} w={7} h={2} c={shoe} />
      <P x={16} y={57} w={3} h={1} c={shoeHi} />

      {/* Kaki Kanan */}
      <P x={25} y={47} w={7} h={10} c={out} />
      <P x={26} y={47} w={5} h={9} c={pants} />
      <P x={27} y={48} w={2} h={7} c={pantsHi} />
      <P x={26} y={48} w={1} h={8} c={pantsSh} />
      {/* Sepatu Kanan */}
      <P x={25} y={56} w={9} h={4} c={out} />
      <P x={26} y={57} w={7} h={2} c={shoe} />
      <P x={29} y={57} w={3} h={1} c={shoeHi} />

      {/* Pinggang / Sabuk */}
      <P x={16} y={45} w={16} h={3} c={out} />
      <P x={17} y={45} w={14} h={2} c={pantsSh} />

      {/* ---- LEHER ---- */}
      <P x={20} y={29} w={8} h={4} c={out} />
      <P x={21} y={29} w={6} h={3} c={skinSh} />
      <P x={22} y={30} w={4} h={2} c={skinDeep} />

      {/* ---- TELINGA ---- */}
      {/* Telinga Kiri */}
      <P x={11} y={18} w={3} h={6} c={out} />
      <P x={12} y={19} w={2} h={4} c={skin} />
      <P x={13} y={20} w={1} h={2} c={skinDeep} />
      {/* Telinga Kanan */}
      <P x={34} y={18} w={3} h={6} c={out} />
      <P x={34} y={19} w={2} h={4} c={skin} />
      <P x={34} y={20} w={1} h={2} c={skinDeep} />

      {/* ---- KEPALA & WAJAH ---- */}
      <P x={14} y={9} w={20} h={20} c={out} />
      <P x={13} y={11} w={22} h={16} c={out} />
      <P x={15} y={28} w={18} h={2} c={out} />

      {/* Isi Wajah */}
      <P x={15} y={10} w={18} h={18} c={skin} />
      <P x={14} y={12} w={20} h={14} c={skin} />
      <P x={16} y={28} w={16} h={1} c={skinSh} />

      {/* Highlight Dahi & Pipi */}
      <P x={17} y={11} w={12} h={3} c={skinHi} />
      <P x={16} y={21} w={3} h={3} c={skinHi} />
      <P x={29} y={21} w={3} h={3} c={skinHi} />

      {/* Bayangan Rahang & Samping Wajah */}
      <P x={14} y={23} w={2} h={3} c={skinSh} />
      <P x={32} y={23} w={2} h={3} c={skinSh} />
      <P x={16} y={26} w={16} h={2} c={skinSh} />

      {/* Alis Tebal Ekspresif */}
      <P x={16} y={15} w={6} h={2} c={brow} />
      <P x={26} y={15} w={6} h={2} c={brow} />

      {/* Kantung Mata Khas QA Lembur */}
      <P x={17} y={21} w={5} h={1} c={bag} />
      <P x={26} y={21} w={5} h={1} c={bag} />

      {/* Hidung */}
      <P x={23} y={20} w={2} h={3} c={skinSh} />
      <P x={23} y={22} w={3} h={1} c={skinDeep} />

      {/* Mulut Serius + Bayangan Dagu */}
      <P x={21} y={25} w={6} h={1} c={skinDeep} />
      <P x={22} y={26} w={4} h={1} c={skinHi} />

      {/* Tangan Kanan (mengepal di samping badan) */}
      <P x={11} y={41} w={4} h={4} c={out} />
      <P x={12} y={41} w={2} h={3} c={skin} />
      <P x={13} y={43} w={1} h={1} c={skinSh} />

      {/* Tangan Kiri (jika tidak memegang kopi, turun di samping badan) */}
      {!hasCoffee && (
        <>
          <P x={33} y={41} w={4} h={4} c={out} />
          <P x={34} y={41} w={2} h={3} c={skin} />
          <P x={34} y={43} w={1} h={1} c={skinSh} />
        </>
      )}
    </g>
  )
}

function OutfitLayer({ body, hasCoffee }) {
  const out = '#16111b'

  if (body === 'flannel') {
    // Kemeja Flannel Merah Kotak-Kotak
    const red = '#b82d28'
    const redHi = '#d6453d'
    const redDark = '#7d1b19'
    const stripe = '#22171b'
    const inner = '#282c38'
    return (
      <g>
        {/* Outline Torso & Lengan */}
        <P x={13} y={31} w={22} h={15} c={out} />
        <P x={11} y={33} w={2} h={9} c={out} />
        {!hasCoffee ? (
          <P x={35} y={33} w={2} h={9} c={out} />
        ) : (
          <P x={35} y={33} w={5} h={7} c={out} />
        )}

        {/* Isi Badan Flannel */}
        <P x={14} y={32} w={20} h={13} c={red} />
        {/* Lengan Kiri & Kanan */}
        <P x={12} y={34} w={2} h={7} c={redDark} />
        {!hasCoffee ? (
          <P x={34} y={34} w={2} h={7} c={redDark} />
        ) : (
          <P x={34} y={34} w={5} h={5} c={red} />
        )}

        {/* Kaos Dalam di Leher */}
        <P x={21} y={31} w={6} h={3} c={inner} />
        {/* Kerah Flannel */}
        <P x={19} y={30} w={3} h={3} c={redHi} />
        <P x={26} y={30} w={3} h={3} c={redHi} />

        {/* Motif Kotak-Kotak Tartan Flannel */}
        <P x={14} y={35} w={20} h={1} c={stripe} />
        <P x={14} y={39} w={20} h={1} c={stripe} />
        <P x={14} y={43} w={20} h={1} c={stripe} />
        <P x={18} y={32} w={1} h={13} c={redDark} />
        <P x={23} y={34} w={2} h={11} c={stripe} />
        <P x={29} y={32} w={1} h={13} c={redDark} />
      </g>
    )
  }

  if (body === 'polo') {
    // Kaos Polo Hijau Segar
    const grn = '#2ca649'
    const grnHi = '#47c966'
    const grnSh = '#1d7532'
    return (
      <g>
        <P x={13} y={31} w={22} h={15} c={out} />
        <P x={11} y={33} w={2} h={9} c={out} />
        {!hasCoffee ? (
          <P x={35} y={33} w={2} h={9} c={out} />
        ) : (
          <P x={35} y={33} w={5} h={7} c={out} />
        )}

        <P x={14} y={32} w={20} h={13} c={grn} />
        <P x={15} y={33} w={5} h={10} c={grnHi} />
        <P x={31} y={33} w={3} h={11} c={grnSh} />

        {/* Lengan */}
        <P x={12} y={34} w={2} h={7} c={grnSh} />
        {!hasCoffee ? (
          <P x={34} y={34} w={2} h={7} c={grnSh} />
        ) : (
          <P x={34} y={34} w={5} h={5} c={grn} />
        )}

        {/* Kerah Polo & Plaket Kancing */}
        <P x={19} y={30} w={3} h={3} c={grnHi} />
        <P x={26} y={30} w={3} h={3} c={grnHi} />
        <P x={23} y={32} w={2} h={5} c={grnSh} />
        <P x={23} y={33} w={1} h={1} c="#e8f5e9" />
        <P x={23} y={35} w={1} h={1} c="#e8f5e9" />
        {/* Logo kecil di dada */}
        <P x={28} y={35} w={2} h={2} c="#ffd23e" />
      </g>
    )
  }

  if (body === 'jacket') {
    // Jaket Tech Lead Hitam/Charcoal terbuka + kemeja biru gelap di dalam (persis karakter PREVIEW referensi!)
    const jkt = '#2d313d'
    const jktHi = '#43495a'
    const jktSh = '#1e2029'
    const shirt = '#395170'
    const shirtHi = '#4d6b91'
    return (
      <g>
        <P x={13} y={31} w={22} h={15} c={out} />
        <P x={11} y={33} w={2} h={9} c={out} />
        {!hasCoffee ? (
          <P x={35} y={33} w={2} h={9} c={out} />
        ) : (
          <P x={35} y={33} w={5} h={7} c={out} />
        )}

        {/* Badan Jaket */}
        <P x={14} y={32} w={20} h={13} c={jkt} />
        <P x={15} y={33} w={3} h={11} c={jktHi} />
        <P x={31} y={33} w={3} h={11} c={jktSh} />

        {/* Kemeja Dalam di Tengah */}
        <P x={20} y={32} w={8} h={13} c={shirt} />
        <P x={21} y={32} w={2} h={12} c={shirtHi} />
        {/* Resleting / Tepian Jaket */}
        <P x={19} y={31} w={1} h={14} c={out} />
        <P x={28} y={31} w={1} h={14} c={out} />

        {/* Kerah Jaket */}
        <P x={18} y={30} w={3} h={3} c={jktHi} />
        <P x={27} y={30} w={3} h={3} c={jktHi} />

        {/* Aksen Strip Cyan di Dada Kanan (persis gambar referensi) */}
        <P x={16} y={36} w={3} h={1} c="#5ce1e6" />

        {/* Lengan */}
        <P x={12} y={34} w={2} h={7} c={jktSh} />
        {!hasCoffee ? (
          <P x={34} y={34} w={2} h={7} c={jktSh} />
        ) : (
          <P x={34} y={34} w={5} h={5} c={jkt} />
        )}
      </g>
    )
  }

  // Default: 'hoodie' (Hoodie Navy/Dark dengan tali putih & kantong depan)
  const hoo = '#273147'
  const hooHi = '#394766'
  const hooSh = '#1a2130'
  return (
    <g>
      <P x={13} y={31} w={22} h={15} c={out} />
      <P x={11} y={33} w={2} h={9} c={out} />
      {!hasCoffee ? (
        <P x={35} y={33} w={2} h={9} c={out} />
      ) : (
        <P x={35} y={33} w={5} h={7} c={out} />
      )}

      <P x={14} y={32} w={20} h={13} c={hoo} />
      <P x={15} y={33} w={4} h={10} c={hooHi} />
      <P x={30} y={33} w={4} h={11} c={hooSh} />

      {/* Tudung/Kerah Hoodie */}
      <P x={18} y={30} w={12} h={3} c={hooHi} />
      <P x={21} y={31} w={6} h={2} c={hooSh} />

      {/* Kantong Kanguru */}
      <P x={18} y={40} w={12} h={4} c={hooSh} />
      <P x={19} y={41} w={10} h={3} c={hoo} />

      {/* Tali Hoodie Putih */}
      <P x={21} y={33} w={1} h={5} c="#e8eef7" />
      <P x={26} y={33} w={1} h={5} c="#e8eef7" />

      {/* Lengan */}
      <P x={12} y={34} w={2} h={7} c={hooSh} />
      {!hasCoffee ? (
        <P x={34} y={34} w={2} h={7} c={hooSh} />
      ) : (
        <P x={34} y={34} w={5} h={5} c={hoo} />
      )}
    </g>
  )
}

function LanyardLayer() {
  return (
    <g>
      {/* Tali Lanyard Biru */}
      <P x={20} y={31} w={1} h={6} c="#3b82f6" />
      <P x={27} y={31} w={1} h={6} c="#3b82f6" />
      <P x={21} y={36} w={6} h={1} c="#3b82f6" />
      {/* Klip Perak */}
      <P x={23} y={37} w={2} h={1} c="#cbd5e1" />
      {/* Kartu ID Putih */}
      <P x={21} y={38} w={6} h={6} c="#16111b" />
      <P x={22} y={38} w={4} h={5} c="#f1f5f9" />
      {/* Foto & Garis di ID Card */}
      <P x={22} y={39} w={2} h={2} c="#e11d48" />
      <P x={24} y={39} w={2} h={1} c="#3b82f6" />
      <P x={22} y={41} w={4} h={1} c="#64748b" />
    </g>
  )
}

function EyesAndGlassesLayer({ eyes }) {
  const pupil = '#1e1416'
  const white = '#f8fafc'
  const lid = '#9e6248'

  if (eyes === 'sleepy') {
    return (
      <g>
        {/* Kelopak Mata Sayu Setengah Tertutup */}
        <P x={17} y={17} w={5} h={2} c={lid} />
        <P x={26} y={17} w={5} h={2} c={lid} />
        <P x={17} y={19} w={5} h={2} c={white} />
        <P x={26} y={19} w={5} h={2} c={white} />
        <P x={19} y={19} w={2} h={2} c={pupil} />
        <P x={28} y={19} w={2} h={2} c={pupil} />
      </g>
    )
  }

  if (eyes === 'wide') {
    return (
      <g>
        {/* Mata Melek Penuh Kafein */}
        <P x={17} y={17} w={5} h={4} c={white} />
        <P x={26} y={17} w={5} h={4} c={white} />
        <P x={19} y={18} w={2} h={2} c={pupil} />
        <P x={28} y={18} w={2} h={2} c={pupil} />
        <P x={19} y={18} w={1} h={1} c="#ffffff" />
        <P x={28} y={18} w={1} h={1} c="#ffffff" />
      </g>
    )
  }

  if (eyes === 'round') {
    return (
      <g>
        {/* Kacamata Bulat Skena */}
        <P x={14} y={18} w={2} h={1} c="#1b1924" />
        <P x={32} y={18} w={2} h={1} c="#1b1924" />
        <P x={22} y={18} w={4} h={1} c="#1b1924" />
        {/* Frame Bulat Kiri */}
        <P x={16} y={16} w={6} h={5} c="#1b1924" />
        <P x={17} y={17} w={4} h={3} c="#93e5ff" />
        <P x={17} y={17} w={2} h={1} c="#ffffff" />
        <P x={19} y={18} w={2} h={2} c="#2c3e50" />
        {/* Frame Bulat Kanan */}
        <P x={26} y={16} w={6} h={5} c="#1b1924" />
        <P x={27} y={17} w={4} h={3} c="#93e5ff" />
        <P x={27} y={17} w={2} h={1} c="#ffffff" />
        <P x={29} y={18} w={2} h={2} c="#2c3e50" />
      </g>
    )
  }

  // Default: 'square' (Kacamata Kotak Tebal khas QA Lead di gambar referensi)
  return (
    <g>
      {/* Gagang & Bridge Kacamata */}
      <P x={13} y={17} w={3} h={1} c="#18121e" />
      <P x={32} y={17} w={3} h={1} c="#18121e" />
      <P x={22} y={17} w={4} h={2} c="#18121e" />

      {/* Frame Kotak Kiri */}
      <P x={15} y={16} w={8} h={5} c="#18121e" />
      <P x={16} y={17} w={6} h={3} c="#d6f0ff" />
      {/* Mata & Kilau Lensa Kiri */}
      <P x={16} y={17} w={2} h={1} c="#ffffff" />
      <P x={18} y={18} w={3} h={2} c="#2c2228" />

      {/* Frame Kotak Kanan */}
      <P x={25} y={16} w={8} h={5} c="#18121e" />
      <P x={26} y={17} w={6} h={3} c="#d6f0ff" />
      {/* Mata & Kilau Lensa Kanan */}
      <P x={26} y={17} w={2} h={1} c="#ffffff" />
      <P x={28} y={18} w={3} h={2} c="#2c2228" />
    </g>
  )
}

function HairLayer({ hair }) {
  const out = '#16111b'
  const hBase = '#382521'
  const hHi = '#543932'
  const hSh = '#241715'

  if (hair === 'side') {
    // Rambut Belah Samping Rapi
    return (
      <g>
        <P x={13} y={6} w={22} h={7} c={out} />
        <P x={12} y={9} w={3} h={9} c={out} />
        <P x={33} y={9} w={3} h={8} c={out} />

        <P x={14} y={7} w={20} h={5} c={hBase} />
        <P x={16} y={7} w={12} h={2} c={hHi} />
        {/* Poni menyapu ke kanan */}
        <P x={18} y={12} w={15} h={2} c={hBase} />
        <P x={22} y={13} w={10} h={1} c={hSh} />
        {/* Cambang */}
        <P x={13} y={10} w={2} h={7} c={hSh} />
        <P x={33} y={10} w={2} h={6} c={hSh} />
      </g>
    )
  }

  if (hair === 'undercut') {
    // Rambut Undercut / Pompadour Modern
    return (
      <g>
        <P x={15} y={4} w={19} h={8} c={out} />
        <P x={16} y={5} w={17} h={6} c={hBase} />
        <P x={18} y={5} w={12} h={3} c={hHi} />
        <P x={17} y={10} w={15} h={2} c={hSh} />
        {/* Sisi tipis fade */}
        <P x={14} y={11} w={2} h={5} c={hSh} />
        <P x={32} y={11} w={2} h={5} c={hSh} />
      </g>
    )
  }

  if (hair === 'cap') {
    // Topi Trucker Merah-Kuning
    const red = '#c93028'
    const redSh = '#8f1e18'
    const yel = '#f5c230'
    return (
      <g>
        {/* Rambut samping di bawah topi */}
        <P x={13} y={12} w={2} h={6} c={hSh} />
        <P x={33} y={12} w={2} h={6} c={hSh} />
        {/* Outline Topi */}
        <P x={13} y={5} w={22} h={8} c={out} />
        <P x={12} y={11} w={26} h={3} c={out} />
        {/* Mahkota Topi */}
        <P x={14} y={6} w={20} h={6} c={red} />
        {/* Panel Depan Kuning */}
        <P x={18} y={6} w={12} h={5} c={yel} />
        <P x={22} y={8} w={4} h={2} c={red} />
        {/* Visor / Lidah Topi */}
        <P x={13} y={12} w={24} h={2} c={redSh} />
        <P x={15} y={12} w={18} h={1} c={red} />
      </g>
    )
  }

  // Default: 'messy' (Spiky Messy Hair persis karakter PREVIEW di gambar referensi!)
  return (
    <g>
      {/* Jambul & Spike Outline */}
      <P x={15} y={4} w={4} h={3} c={out} />
      <P x={21} y={3} w={6} h={4} c={out} />
      <P x={29} y={4} w={5} h={3} c={out} />
      <P x={12} y={6} w={24} h={8} c={out} />
      <P x={10} y={9} w={4} h={6} c={out} />
      <P x={34} y={9} w={4} h={6} c={out} />
      <P x={12} y={13} w={3} h={6} c={out} />
      <P x={33} y={13} w={3} h={6} c={out} />

      {/* Isi Rambut Messy */}
      <P x={16} y={5} w={3} h={3} c={hBase} />
      <P x={22} y={4} w={4} h={4} c={hHi} />
      <P x={29} y={5} w={4} h={3} c={hBase} />
      <P x={13} y={7} w={22} h={6} c={hBase} />
      <P x={11} y={10} w={3} h={4} c={hBase} />
      <P x={34} y={10} w={3} h={4} c={hBase} />

      {/* Highlight & Tekstur Acak */}
      <P x={16} y={7} w={5} h={3} c={hHi} />
      <P x={23} y={6} w={6} h={3} c={hHi} />
      <P x={30} y={8} w={3} h={2} c={hHi} />

      {/* Poni Berantakan Turun ke Dahi & Cambang */}
      <P x={15} y={12} w={4} h={2} c={hSh} />
      <P x={21} y={12} w={5} h={2} c={hBase} />
      <P x={28} y={12} w={5} h={2} c={hSh} />
      <P x={13} y={13} w={2} h={5} c={hSh} />
      <P x={33} y={13} w={2} h={5} c={hSh} />
    </g>
  )
}

function HeadgearAccessoryLayer({ headgearAcc }) {
  if (!headgearAcc) return null
  const out = '#16111b'
  const band = '#475569'
  const cup = '#1e293b'
  const neon = '#38bdf8'

  return (
    <g>
      {/* Band di atas kepala */}
      <P x={12} y={5} w={24} h={2} c={out} />
      <P x={13} y={5} w={22} h={1} c={band} />
      <P x={11} y={7} w={2} h={11} c={band} />
      <P x={35} y={7} w={2} h={11} c={band} />

      {/* Earcup Kiri & Kanan */}
      <P x={9} y={16} w={5} h={8} c={out} />
      <P x={10} y={17} w={3} h={6} c={cup} />
      <P x={10} y={19} w={2} h={2} c={neon} />

      <P x={34} y={16} w={5} h={8} c={out} />
      <P x={35} y={17} w={3} h={6} c={cup} />
      <P x={36} y={19} w={2} h={2} c={neon} />

      {/* Boom Mic jika memilih 'headset' */}
      {headgearAcc === 'headset' && (
        <>
          <P x={11} y={24} w={8} h={2} c={out} />
          <P x={12} y={24} w={7} h={1} c="#94a3b8" />
          <P x={18} y={24} w={3} h={3} c={out} />
          <P x={19} y={25} w={2} h={1} c={neon} />
        </>
      )}
    </g>
  )
}

function CoffeeHandLayer() {
  const out = '#16111b'
  const skin = '#d7966b'
  const cupWhite = '#f1f5f9'
  const cupSh = '#cbd5e1'
  const sleeve = '#854d27'
  const sleeveHi = '#a36236'

  return (
    <g>
      {/* Cup Kopi Takeaway + Tutup Putih + Sleeve Coklat (persis gambar referensi) */}
      <P x={37} y={28} w={9} h={2} c={out} />
      <P x={36} y={29} w={11} h={3} c={out} />
      <P x={37} y={30} w={9} h={1} c={cupWhite} />
      <P x={38} y={29} w={7} h={1} c={cupWhite} />

      {/* Badan Cup */}
      <P x={37} y={32} w={9} h={11} c={out} />
      <P x={38} y={32} w={7} h={10} c={cupWhite} />
      <P x={43} y={32} w={2} h={10} c={cupSh} />

      {/* Sleeve Karton Coklat */}
      <P x={38} y={34} w={7} h={5} c={sleeve} />
      <P x={39} y={35} w={3} h={3} c={sleeveHi} />

      {/* Jari Tangan Memegang Cup */}
      <P x={36} y={35} w={3} h={4} c={out} />
      <P x={37} y={36} w={2} h={2} c={skin} />
      <P x={44} y={35} w={3} h={4} c={out} />
      <P x={44} y={36} w={2} h={2} c={skin} />
    </g>
  )
}

export default function Character({
  look: rawLook,
  size = 160,
  glow = false,
  className = '',
  style = {},
}) {
  const look = normalizeLook(rawLook)

  return (
    <div
      className={`character-stack flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size * 1.18,
        filter: glow
          ? 'drop-shadow(0 0 3px #86efac) drop-shadow(0 0 10px rgba(74, 222, 128, 0.45))'
          : undefined,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 48 62"
        width="100%"
        height="100%"
        shapeRendering="crispEdges"
        style={{ overflow: 'visible' }}
      >
        <BaseHeadAndLegs hasCoffee={look.coffee} />
        <OutfitLayer body={look.body} hasCoffee={look.coffee} />
        {look.lanyard && <LanyardLayer />}
        <EyesAndGlassesLayer eyes={look.eyes} />
        <HairLayer hair={look.hair} />
        <HeadgearAccessoryLayer headgearAcc={look.headgearAcc} />
        {look.coffee && <CoffeeHandLayer />}
      </svg>
    </div>
  )
}

// ============================================================================
// IKON ITEM PIXEL ART UNTUK SLOT CUSTOMIZER & SHOP (Grid 24 x 24)
// ============================================================================
export function CosmeticIcon({ id, size = 48 }) {
  const out = '#141019'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
    >
      {/* ---- HAIR ICONS ---- */}
      {id === 'side' && (
        <g>
          <P x={4} y={5} w={16} h={12} c={out} />
          <P x={5} y={6} w={14} h={6} c="#382521" />
          <P x={7} y={6} w={9} h={2} c="#543932" />
          <P x={9} y={11} w={10} h={3} c="#382521" />
          <P x={5} y={11} w={2} h={6} c="#241715" />
          <P x={17} y={12} w={2} h={5} c="#241715" />
        </g>
      )}
      {id === 'messy' && (
        <g>
          <P x={6} y={3} w={3} h={3} c={out} />
          <P x={10} y={2} w={5} h={4} c={out} />
          <P x={16} y={4} w={3} h={3} c={out} />
          <P x={3} y={5} w={18} h={13} c={out} />
          <P x={4} y={6} w={16} h={7} c="#382521" />
          <P x={11} y={4} w={3} h={3} c="#543932" />
          <P x={7} y={6} w={10} h={3} c="#543932" />
          <P x={4} y={12} w={3} h={5} c="#241715" />
          <P x={17} y={12} w={3} h={5} c="#241715" />
          <P x={9} y={12} w={5} h={2} c="#241715" />
        </g>
      )}
      {id === 'undercut' && (
        <g>
          <P x={5} y={3} w={14} h={10} c={out} />
          <P x={6} y={4} w={12} h={6} c="#382521" />
          <P x={7} y={4} w={9} h={3} c="#543932" />
          <P x={6} y={10} w={3} h={7} c="#6b534e" />
          <P x={7} y={10} w={11} h={2} c="#241715" />
        </g>
      )}
      {id === 'cap' && (
        <g>
          <P x={3} y={6} w={16} h={9} c={out} />
          <P x={3} y={13} w={19} h={3} c={out} />
          <P x={4} y={7} w={14} h={6} c="#c93028" />
          <P x={8} y={7} w={7} h={5} c="#f5c230" />
          <P x={10} y={9} w={3} h={2} c="#c93028" />
          <P x={4} y={13} w={17} h={2} c="#8f1e18" />
        </g>
      )}

      {/* ---- EYES & GLASSES ICONS ---- */}
      {id === 'sleepy' && (
        <g>
          <P x={3} y={8} w={7} h={7} c={out} />
          <P x={14} y={8} w={7} h={7} c={out} />
          <P x={4} y={9} w={5} h={2} c="#b87658" />
          <P x={15} y={9} w={5} h={2} c="#b87658" />
          <P x={4} y={11} w={5} h={2} c="#f8fafc" />
          <P x={15} y={11} w={5} h={2} c="#f8fafc" />
          <P x={6} y={11} w={2} h={2} c="#1e1416" />
          <P x={17} y={11} w={2} h={2} c="#1e1416" />
          <P x={4} y={13} w={5} h={2} c="#7a4d57" />
          <P x={15} y={13} w={5} h={2} c="#7a4d57" />
        </g>
      )}
      {id === 'wide' && (
        <g>
          <P x={3} y={7} w={7} h={8} c={out} />
          <P x={14} y={7} w={7} h={8} c={out} />
          <P x={4} y={8} w={5} h={6} c="#ffffff" />
          <P x={15} y={8} w={5} h={6} c="#ffffff" />
          <P x={6} y={10} w={2} h={2} c="#1e1416" />
          <P x={17} y={10} w={2} h={2} c="#1e1416" />
        </g>
      )}
      {id === 'round' && (
        <g>
          <P x={2} y={11} w={20} h={2} c={out} />
          <P x={3} y={8} w={7} h={7} c={out} />
          <P x={14} y={8} w={7} h={7} c={out} />
          <P x={4} y={9} w={5} h={5} c="#9be8ff" />
          <P x={15} y={9} w={5} h={5} c="#9be8ff" />
          <P x={5} y={10} w={2} h={1} c="#ffffff" />
          <P x={16} y={10} w={2} h={1} c="#ffffff" />
        </g>
      )}
      {id === 'square' && (
        <g>
          <P x={1} y={10} w={22} h={2} c={out} />
          <P x={2} y={8} w={9} h={7} c={out} />
          <P x={13} y={8} w={9} h={7} c={out} />
          <P x={3} y={9} w={7} h={5} c="#bfefff" />
          <P x={14} y={9} w={7} h={5} c="#bfefff" />
          <P x={4} y={10} w={2} h={1} c="#ffffff" />
          <P x={15} y={10} w={2} h={1} c="#ffffff" />
        </g>
      )}

      {/* ---- OUTFITS ICONS ---- */}
      {id === 'hoodie' && (
        <g>
          <P x={4} y={4} w={16} h={17} c={out} />
          <P x={5} y={5} w={14} h={15} c="#273147" />
          <P x={8} y={4} w={8} h={3} c="#394766" />
          <P x={10} y={7} w={1} h={5} c="#f1f5f9" />
          <P x={13} y={7} w={1} h={5} c="#f1f5f9" />
          <P x={8} y={14} w={8} h={4} c="#1a2130" />
        </g>
      )}
      {id === 'flannel' && (
        <g>
          <P x={4} y={4} w={16} h={17} c={out} />
          <P x={5} y={5} w={14} h={15} c="#b82d28" />
          <P x={5} y={9} w={14} h={1} c="#22171b" />
          <P x={5} y={14} w={14} h={1} c="#22171b" />
          <P x={9} y={5} w={1} h={15} c="#7d1b19" />
          <P x={14} y={5} w={1} h={15} c="#7d1b19" />
          <P x={11} y={5} w={2} h={15} c="#22171b" />
        </g>
      )}
      {id === 'polo' && (
        <g>
          <P x={4} y={4} w={16} h={17} c={out} />
          <P x={5} y={5} w={14} h={15} c="#2ca649" />
          <P x={8} y={4} w={3} h={3} c="#47c966" />
          <P x={13} y={4} w={3} h={3} c="#47c966" />
          <P x={11} y={6} w={2} h={6} c="#1d7532" />
          <P x={15} y={9} w={2} h={2} c="#ffd23e" />
        </g>
      )}
      {id === 'jacket' && (
        <g>
          <P x={4} y={4} w={16} h={17} c={out} />
          <P x={5} y={5} w={14} h={15} c="#2d313d" />
          <P x={10} y={5} w={4} h={15} c="#395170" />
          <P x={9} y={5} w={1} h={15} c={out} />
          <P x={14} y={5} w={1} h={15} c={out} />
          <P x={6} y={9} w={2} h={1} c="#5ce1e6" />
        </g>
      )}

      {/* ---- ACCESSORIES ICONS ---- */}
      {id === 'headphones' && (
        <g>
          <P x={5} y={4} w={14} h={10} c={out} />
          <P x={7} y={6} w={10} h={8} c="#1d4ed8" />
          <P x={6} y={5} w={12} h={2} c="#64748b" />
          <P x={3} y={11} w={5} h={8} c={out} />
          <P x={16} y={11} w={5} h={8} c={out} />
          <P x={4} y={12} w={3} h={6} c="#334155" />
          <P x={17} y={12} w={3} h={6} c="#334155" />
        </g>
      )}
      {id === 'headset' && (
        <g>
          <P x={5} y={3} w={14} h={10} c={out} />
          <P x={6} y={4} w={12} h={2} c="#64748b" />
          <P x={3} y={10} w={5} h={8} c={out} />
          <P x={16} y={10} w={5} h={8} c={out} />
          <P x={4} y={11} w={3} h={6} c="#334155" />
          <P x={17} y={11} w={3} h={6} c="#334155" />
          <P x={5} y={13} w={1} h={2} c="#4deeea" />
          <P x={6} y={18} w={7} h={2} c={out} />
          <P x={11} y={17} w={3} h={3} c="#4deeea" />
        </g>
      )}
      {id === 'lanyard' && (
        <g>
          <P x={8} y={2} w={8} h={6} c="#3b82f6" />
          <P x={10} y={3} w={4} h={4} c="#1d4ed8" />
          <P x={4} y={8} w={16} h={12} c={out} />
          <P x={5} y={9} w={14} h={10} c="#f1f5f9" />
          <P x={6} y={11} w={4} h={5} c="#b85d3b" />
          <P x={7} y={11} w={2} h={2} c="#241715" />
          <P x={12} y={11} w={5} h={1} c="#3b82f6" />
          <P x={12} y={13} w={5} h={1} c="#64748b" />
          <P x={12} y={15} w={4} h={1} c="#64748b" />
        </g>
      )}
      {id === 'coffee' && (
        <g>
          <P x={4} y={6} w={9} h={12} c={out} />
          <P x={5} y={7} w={7} h={10} c="#f1f5f9" />
          <P x={5} y={10} w={7} h={4} c="#9a5b32" />
          <P x={11} y={8} w={9} h={12} c={out} />
          <P x={12} y={9} w={6} h={10} c="#f1f5f9" />
          <P x={12} y={12} w={6} h={4} c="#9a5b32" />
          <P x={18} y={11} w={2} h={5} c="#f1f5f9" />
        </g>
      )}
    </svg>
  )
}
