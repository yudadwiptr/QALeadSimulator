import { useState } from 'react'
import { SHOP_ITEMS } from '../game/data.js'
import {
  ALL_COSMETICS,
  isAccEquipped,
  normalizeLook,
  toggleAccessory,
} from '../game/cosmetics.js'
import Character, { CosmeticIcon } from './Character.jsx'
import { DevAvatar, ShopItemArt } from './PixelArtAssets.jsx'
import { sfx } from '../game/audio.js'

const TOPUP_PACKS = [
  { rp: 'Rp10.000', coins: 800, bonus: 'Starter Pack' },
  { rp: 'Rp25.000', coins: 2200, bonus: '+200 Bonus!' },
  { rp: 'Rp50.000', coins: 5000, bonus: 'Sultan QA Pack' },
]

export default function Shop({
  coins,
  day = 1,
  look: rawLook,
  setLook,
  unlocked = [],
  onBuy,
  onBuyCosmetic,
  onTopup,
  onClose,
}) {
  const [tab, setTab] = useState('boosts') // 'boosts' | 'items' | 'currency'
  const [paying, setPaying] = useState(null)

  const look = normalizeLook(rawLook)
  const isUnlocked = (item) => item.price === 0 || unlocked.includes(item.id)

  const isEquipped = (item) => {
    if (item.slot === 'hair') return look.hair === item.id
    if (item.slot === 'eyes') return look.eyes === item.id
    if (item.slot === 'outfit') return look.body === item.id
    if (item.slot === 'accessory') return isAccEquipped(look, item.id)
    return false
  }

  const equipCosmetic = (item) => {
    if (!setLook) return
    setLook((prev) => {
      const cur = normalizeLook(prev)
      if (item.slot === 'hair') return { ...cur, hair: item.id }
      if (item.slot === 'eyes') return { ...cur, eyes: item.id }
      if (item.slot === 'outfit') return { ...cur, body: item.id }
      if (item.slot === 'accessory') return toggleAccessory(cur, item.id)
      return cur
    })
  }

  const pay = (pack, i) => {
    sfx.click()
    setPaying(i)
    setTimeout(() => {
      setPaying(null)
      setTab('boosts')
      onTopup(pack.coins)
      sfx.cash()
    }, 1200)
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4, 6, 12, 0.84)' }}
    >
      {/* Monitor Frame Sesuai Referensi 4.jfif */}
      <div
        className="pixel-panel relative flex flex-col overflow-hidden"
        style={{
          width: 880,
          height: 550,
          background:
            'radial-gradient(circle at top, #102444 0%, #070d1c 70%, #050811 100%)',
          border: '4px solid #38bdf8',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.3), 0 10px 0 #000',
        }}
      >
        {/* TOP HEADER BAR (Sesuai 4.jfif) */}
        <div
          className="relative flex items-center justify-between px-5 py-3"
          style={{
            background: 'rgba(8, 15, 32, 0.92)',
            borderBottom: '3px solid #1e3a8a',
          }}
        >
          {/* Pop-up Promo Kecil di Kiri Atas */}
          <div
            className="flex items-center gap-2 px-2.5 py-1.5"
            style={{
              background: '#f8fafc',
              color: '#0f172a',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.5)',
            }}
          >
            <DevAvatar name="Budi" size={26} />
            <div style={{ lineHeight: 1 }}>
              <div className="font-pixel" style={{ fontSize: 7, color: '#dc2626' }}>
                SALE!
              </div>
              <div className="font-pixel" style={{ fontSize: 7, color: '#0f172a', marginTop: 2 }}>
                SAVE YOUR BUILD!
              </div>
            </div>
          </div>

          {/* Neon Octagonal QA SHOP Sign */}
          <div
            className="px-8 py-2"
            style={{
              background: 'linear-gradient(to bottom, #0b3b3c, #072227)',
              border: '3px solid #4ade80',
              boxShadow: '0 0 0 2px #d946ef, 0 0 14px rgba(74, 222, 128, 0.5)',
            }}
          >
            <span
              className="font-pixel"
              style={{
                fontSize: 22,
                color: '#4ade80',
                textShadow: '3px 3px 0 #000',
                letterSpacing: 3,
              }}
            >
              QA SHOP
            </span>
          </div>

          {/* Kanan: Balance + Day + Tombol Close */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-pixel" style={{ fontSize: 8, color: '#94a3b8' }}>
                DAY {day} · BALANCE
              </div>
              <div className="font-pixel mt-1" style={{ fontSize: 12, color: '#ffd23e' }}>
                🪙 {coins.toLocaleString('id-ID')} QA Coins
              </div>
            </div>
            <button
              className="pixel-btn btn-red"
              style={{ fontSize: 10, padding: '6px 10px' }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* MAIN SHOP AREA: Sidebar Kiri + Konten Kanan */}
        <div className="flex min-h-0 flex-1 gap-4 p-4">
          {/* LEFT SIDEBAR NAVIGATION (ITEMS / BOOSTS / CURRENCY seperti 4.jfif) */}
          <div className="flex w-28 flex-col justify-between">
            <div className="flex flex-col gap-3">
              {[
                { id: 'boosts', icon: '⚡', label: 'BOOSTS', border: '#ec4899' },
                { id: 'items', icon: '👕', label: 'ITEMS', border: '#4ade80' },
                { id: 'currency', icon: '🪙', label: 'CURRENCY', border: '#f59e0b' },
              ].map((nav) => {
                const active = tab === nav.id
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      sfx.click()
                      setTab(nav.id)
                    }}
                    className="flex flex-col items-center justify-center gap-1.5 py-3"
                    style={{
                      background: active
                        ? 'linear-gradient(to bottom, #1e3a8a, #0f172a)'
                        : '#0b1324',
                      border: `3px solid ${active ? nav.border : '#1e293b'}`,
                      boxShadow: active ? `0 0 10px ${nav.border}66` : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{nav.icon}</span>
                    <span
                      className="font-pixel"
                      style={{
                        fontSize: 8,
                        color: active ? '#ffffff' : '#94a3b8',
                      }}
                    >
                      {nav.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Badge Sticky bawah di sidebar */}
            <div
              className="p-2 text-center"
              style={{
                background: '#d9bc5b',
                color: '#2a2005',
                border: '2px solid #000',
                fontSize: 15,
                lineHeight: 1.05,
                transform: 'rotate(-2deg)',
              }}
            >
              <b>BUY SHIELDS ON FRIDAY!</b>
            </div>
          </div>

          {/* RIGHT CONTENT BOX */}
          <div
            className="flex min-h-0 flex-1 flex-col p-3"
            style={{
              background: 'rgba(8, 14, 28, 0.9)',
              border: '3px solid #38bdf8',
            }}
          >
            {/* ==================== TAB 1: BOOSTS (4 Kartu 4.jfif) ==================== */}
            {tab === 'boosts' && (
              <div className="grid flex-1 grid-cols-2 gap-3">
                {SHOP_ITEMS.map((it) => {
                  const canAfford = coins >= it.price
                  return (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 p-3"
                      style={{
                        background: 'linear-gradient(135deg, #0d1830 0%, #070c18 100%)',
                        border: '2px solid #2563eb',
                        boxShadow: 'inset 0 0 12px rgba(37, 99, 235, 0.2)',
                      }}
                    >
                      {/* Ilustrasi Pixel Art Besar di Kiri */}
                      <div
                        className="flex items-center justify-center p-2"
                        style={{
                          width: 96,
                          height: 112,
                          background: '#060a14',
                          border: '2px solid #1e3a8a',
                          flexShrink: 0,
                        }}
                      >
                        <ShopItemArt id={it.id} size={82} />
                      </div>

                      {/* Deskripsi & Tombol Split BUY | PRICE di Kanan */}
                      <div className="flex h-full flex-1 flex-col justify-between">
                        <div>
                          <div
                            className="font-pixel"
                            style={{
                              fontSize: 12,
                              color: '#ffffff',
                              textShadow: '2px 2px 0 #000',
                            }}
                          >
                            '{it.name}'
                          </div>
                          <div
                            style={{
                              fontSize: 17,
                              color: '#cbd5e1',
                              lineHeight: 1.15,
                              marginTop: 5,
                            }}
                          >
                            <span style={{ color: '#ffd23e', fontWeight: 'bold' }}>
                              {it.name}:
                            </span>{' '}
                            {it.desc}
                          </div>
                        </div>

                        {/* Tombol Split Merah + Kuning Sesuai 4.jfif */}
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            sfx.cash()
                            onBuy(it)
                          }}
                          className="mt-2 flex w-full items-stretch overflow-hidden p-0"
                          style={{
                            border: '3px solid #000',
                            cursor: canAfford ? 'pointer' : 'not-allowed',
                            opacity: canAfford ? 1 : 0.45,
                            boxShadow: '0 3px 0 #000',
                          }}
                        >
                          <span
                            className="font-pixel flex items-center justify-center px-3 py-2"
                            style={{
                              fontSize: 10,
                              background: '#dc2626',
                              color: '#ffffff',
                              borderRight: '3px solid #000',
                            }}
                          >
                            BUY
                          </span>
                          <span
                            className="font-pixel flex flex-1 items-center justify-center py-2"
                            style={{
                              fontSize: 9,
                              background: '#f59e0b',
                              color: '#1c1204',
                            }}
                          >
                            {it.price.toLocaleString('id-ID')} QA Coins
                          </span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ==================== TAB 2: ITEMS (Wardrobe & Kosmetik Karakter) ==================== */}
            {tab === 'items' && (
              <div className="flex min-h-0 flex-1 gap-4">
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5 overflow-y-auto pr-1">
                  {ALL_COSMETICS.map((item) => {
                    const owned = isUnlocked(item)
                    const equipped = isEquipped(item)
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-2.5"
                        style={{
                          background: equipped ? '#172e54' : '#0d1629',
                          border: `2px solid ${equipped ? '#ffd23e' : '#1e3a8a'}`,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 48,
                              height: 48,
                              background: '#134284',
                              border: '2px solid #000',
                            }}
                          >
                            <CosmeticIcon id={item.id} size={40} />
                          </div>
                          <div>
                            <div style={{ fontSize: 19, color: '#f8fafc', lineHeight: 1.05 }}>
                              {item.name}
                            </div>
                            <div
                              className="font-pixel"
                              style={{ fontSize: 7, color: '#7dd3fc', marginTop: 3 }}
                            >
                              {item.slot.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {owned ? (
                          <button
                            className={`pixel-btn ${equipped ? 'btn-green' : 'btn-blue'}`}
                            style={{ fontSize: 8, padding: '6px 8px' }}
                            onClick={() => {
                              sfx.click()
                              equipCosmetic(item)
                            }}
                          >
                            {equipped
                              ? item.slot === 'accessory'
                                ? '✔ AKTIF'
                                : '✔ DIPAKAI'
                              : 'PAKAI'}
                          </button>
                        ) : (
                          <button
                            className="pixel-btn btn-yellow"
                            style={{ fontSize: 8, padding: '6px 8px' }}
                            disabled={coins < item.price}
                            onClick={() => {
                              sfx.cash()
                              onBuyCosmetic?.(item)
                              equipCosmetic(item)
                            }}
                          >
                            BELI {item.price}🪙
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Live Character Preview */}
                <div
                  className="flex w-48 flex-col items-center justify-between p-3"
                  style={{
                    background: '#060c18',
                    border: '2px solid #2563eb',
                  }}
                >
                  <div className="font-pixel" style={{ fontSize: 9, color: '#ffd23e' }}>
                    QA LEAD PREVIEW
                  </div>
                  <Character look={look} size={155} glow />
                  <div className="text-center" style={{ fontSize: 16, color: '#94a3b8' }}>
                    Item yang dibeli tersimpan permanen!
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: CURRENCY (Top-Up Portal) ==================== */}
            {tab === 'currency' && (
              <div className="flex flex-1 flex-col justify-between p-3">
                <div>
                  <div className="font-pixel" style={{ fontSize: 12, color: '#ffd23e' }}>
                    💳 PORTAL TOP-UP QA COINS (SIMULASI SATIR)
                  </div>
                  <div style={{ fontSize: 19, color: '#cbd5e1', marginTop: 6 }}>
                    Kehabisan koin buat beli <b>Pro Shield</b> atau <b>Jaket Tech Lead</b>? Pilih paket instan di bawah. Tenang, tidak ada uang asli yang dipotong!
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-4">
                    {TOPUP_PACKS.map((p, i) => (
                      <button
                        key={i}
                        disabled={paying !== null}
                        onClick={() => pay(p, i)}
                        className="pixel-panel flex flex-col items-center justify-center gap-2 p-5"
                        style={{
                          background: 'linear-gradient(to bottom, #1e3a8a, #0f172a)',
                          border: '3px solid #38bdf8',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="font-pixel" style={{ fontSize: 8, color: '#7dd3fc' }}>
                          {p.bonus}
                        </div>
                        <div style={{ fontSize: 32 }}>🪙</div>
                        {paying === i ? (
                          <span className="font-pixel blink" style={{ fontSize: 10, color: '#4ade80' }}>
                            MEMPROSES...
                          </span>
                        ) : (
                          <>
                            <div className="font-pixel" style={{ fontSize: 12, color: '#ffd23e' }}>
                              +{p.coins.toLocaleString('id-ID')} COINS
                            </div>
                            <div
                              className="font-pixel mt-1 px-3 py-1"
                              style={{
                                fontSize: 9,
                                background: '#dc2626',
                                color: '#fff',
                                border: '2px solid #000',
                              }}
                            >
                              {p.rp}
                            </div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3" style={{ borderTop: '2px solid #1e293b' }}>
                  <span style={{ fontSize: 17, color: '#94a3b8' }}>
                    * Waktu shift otomatis dipause selama kamu berada di QA Shop.
                  </span>
                  <button
                    className="pixel-btn btn-green"
                    style={{ fontSize: 9 }}
                    onClick={onClose}
                  >
                    ✔ KEMBALI KE KANBAN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
