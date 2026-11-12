import { useState } from 'react'
import Character, { CosmeticIcon } from './Character.jsx'
import {
  COSMETIC_CATEGORIES,
  isAccEquipped,
  normalizeLook,
  toggleAccessory,
} from '../game/cosmetics.js'
import { sfx } from '../game/audio.js'

const ROWS = [
  {
    key: 'hair',
    icon: '💇',
    title: 'HAIR',
    items: COSMETIC_CATEGORIES.hair,
  },
  {
    key: 'eyes',
    icon: '👓',
    title: 'EYES & GLASSES',
    items: COSMETIC_CATEGORIES.eyes,
  },
  {
    key: 'outfit',
    icon: '👕',
    title: 'OUTFITS',
    items: COSMETIC_CATEGORIES.outfit,
  },
  {
    key: 'accessory',
    icon: '🪪',
    title: 'ACCESSORIES',
    items: COSMETIC_CATEGORIES.accessory,
  },
]

export default function Customizer({
  look: rawLook,
  setLook,
  name: initialName,
  coins = 400,
  unlocked = [],
  onBuyCosmetic,
  onConfirm,
}) {
  const look = normalizeLook(rawLook)
  const [name, setName] = useState(initialName || 'QA Lead')
  const [msg, setMsg] = useState('Klik item untuk pakai · Item terkunci 🔒 bisa dibeli sekarang atau nanti di QA Shop!')

  const isUnlocked = (item) => item.price === 0 || unlocked.includes(item.id)

  const isSelected = (rowKey, itemId) => {
    if (rowKey === 'hair') return look.hair === itemId
    if (rowKey === 'eyes') return look.eyes === itemId
    if (rowKey === 'outfit') return look.body === itemId
    if (rowKey === 'accessory') return isAccEquipped(look, itemId)
    return false
  }

  const equipItem = (rowKey, itemId) => {
    setLook((prev) => {
      const cur = normalizeLook(prev)
      if (rowKey === 'hair') return { ...cur, hair: itemId }
      if (rowKey === 'eyes') return { ...cur, eyes: itemId }
      if (rowKey === 'outfit') return { ...cur, body: itemId }
      if (rowKey === 'accessory') return toggleAccessory(cur, itemId)
      return cur
    })
  }

  const handleSelectOrBuy = (rowKey, item) => {
    if (isUnlocked(item)) {
      sfx.click()
      equipItem(rowKey, item.id)
      setMsg(`✔ Memakai ${item.name}.`)
      return
    }
    // Jika belum terbuka, coba beli dengan QA Coins
    if (coins >= item.price) {
      sfx.cash()
      onBuyCosmetic?.(item)
      equipItem(rowKey, item.id)
      setMsg(`🎉 Membeli & memakai ${item.name} (-${item.price} 🪙)!`)
    } else {
      sfx.error()
      setMsg(`❌ Koin belum cukup untuk ${item.name} (${item.price} 🪙). Bisa dibeli nanti di QA Shop saat gajian!`)
    }
  }

  const cycleRow = (rowKey, items, dir) => {
    const unlockedItems = items.filter((i) => isUnlocked(i))
    if (!unlockedItems.length) return
    sfx.click()
    if (rowKey === 'accessory') {
      const pick = unlockedItems[Math.floor(Math.random() * unlockedItems.length)]
      equipItem('accessory', pick.id)
      return
    }
    const curId = rowKey === 'hair' ? look.hair : rowKey === 'eyes' ? look.eyes : look.body
    const idx = Math.max(0, unlockedItems.findIndex((i) => i.id === curId))
    const next = unlockedItems[(idx + dir + unlockedItems.length) % unlockedItems.length]
    equipItem(rowKey, next.id)
  }

  const randomizeCategory = (rowKey, items) => {
    const unlockedItems = items.filter((i) => isUnlocked(i))
    if (!unlockedItems.length) return
    sfx.open()
    const pick = unlockedItems[Math.floor(Math.random() * unlockedItems.length)]
    equipItem(rowKey, pick.id)
    setMsg(`🎲 Random ${rowKey.toUpperCase()}: ${pick.name}`)
  }

  const activeAccId =
    look.headgearAcc || (look.lanyard ? 'lanyard' : look.coffee ? 'coffee' : 'headphones')

  return (
    <div
      className="flex h-full items-center justify-center gap-5 p-4"
      style={{
        background: 'radial-gradient(circle at center, #162038 0%, #090d18 100%)',
      }}
    >
      {/* ==================== PANEL KIRI: CUSTOMIZE YOUR QA LEAD ==================== */}
      <div
        className="pixel-panel flex flex-col"
        style={{
          width: 610,
          background: '#08152c',
          border: '4px solid #000',
          boxShadow: '0 8px 0 rgba(0,0,0,0.65)',
        }}
      >
        {/* Title Bar Biru */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            background: 'linear-gradient(to bottom, #2b7de0, #1956a8)',
            borderBottom: '4px solid #000',
          }}
        >
          <div
            className="font-pixel"
            style={{ fontSize: 13, color: '#ffd23e', textShadow: '2px 2px 0 #000' }}
          >
            CUSTOMIZE YOUR QA LEAD
          </div>
          <div className="flex items-center gap-2">
            <div
              className="font-pixel px-2 py-1"
              style={{
                fontSize: 9,
                background: '#091428',
                color: '#ffd23e',
                border: '2px solid #000',
              }}
            >
              🪙 {coins.toLocaleString('id-ID')}
            </div>
            <div
              className="font-pixel flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                fontSize: 10,
                background: '#e8a823',
                color: '#000',
                border: '2px solid #000',
              }}
            >
              _
            </div>
            <div
              className="font-pixel flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                fontSize: 10,
                background: '#c93028',
                color: '#fff',
                border: '2px solid #000',
              }}
            >
              ✕
            </div>
          </div>
        </div>

        {/* Body Kiri */}
        <div className="flex flex-col gap-3 p-4">
          {/* Baris Input Nama QA Lead */}
          <div className="flex items-center gap-3">
            <span className="font-pixel" style={{ fontSize: 10, color: '#ffd23e', whiteSpace: 'nowrap' }}>
              👤 NAMA QA:
            </span>
            <input
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
              className="pixel-panel flex-1"
              style={{
                background: '#050c1a',
                color: '#ffffff',
                padding: '5px 10px',
                fontSize: 21,
                fontFamily: 'VT323, monospace',
                border: '2px solid #2b7de0',
                outline: 'none',
              }}
            />
          </div>

          {/* 4 Baris Kategori sesuai gambar referensi */}
          {ROWS.map((row, rIdx) => (
            <div key={row.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between pr-1">
                <div className="font-pixel" style={{ fontSize: 10, color: '#ffd23e' }}>
                  {row.icon} {row.title}
                </div>
                <div className="font-pixel" style={{ fontSize: 8, color: '#d8dbe8' }}>
                  🔀 RANDOMIZE
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Panah Kiri */}
                <button
                  onClick={() => cycleRow(row.key, row.items, -1)}
                  className="font-pixel"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffd23e',
                    fontSize: 14,
                    cursor: 'pointer',
                    padding: '0 2px',
                  }}
                  title="Sebelumnya"
                >
                  ◀
                </button>

                {/* 4 Kotak Item */}
                <div className="grid flex-1 grid-cols-4 gap-2.5">
                  {row.items.map((item) => {
                    const active = isSelected(row.key, item.id)
                    const unlockedItem = isUnlocked(item)
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectOrBuy(row.key, item)}
                        title={
                          unlockedItem
                            ? `${item.name} (Klik untuk pakai)`
                            : `${item.name} — Beli ${item.price} 🪙`
                        }
                        className="relative flex flex-col items-center justify-center"
                        style={{
                          height: 68,
                          background: active
                            ? 'linear-gradient(to bottom, #2989f2, #175cb8)'
                            : '#1554a6',
                          border: active ? '3px solid #ffd23e' : '3px solid #000',
                          boxShadow: active
                            ? '0 0 0 2px #c87d12, inset 0 2px 0 rgba(255,255,255,0.35)'
                            : 'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -3px 0 rgba(0,0,0,0.4)',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        <div style={{ opacity: unlockedItem ? 1 : 0.72 }}>
                          <CosmeticIcon id={item.id} size={46} />
                        </div>

                        {/* Label harga jika masih terkunci */}
                        {!unlockedItem && (
                          <div
                            className="font-pixel absolute inset-x-1 bottom-1 text-center"
                            style={{
                              fontSize: 7,
                              background: 'rgba(6, 10, 20, 0.9)',
                              color: coins >= item.price ? '#ffd23e' : '#ff7b72',
                              padding: '2px 0',
                              border: '1px solid #000',
                            }}
                          >
                            🔒{item.price}🪙
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Panah Kanan */}
                <button
                  onClick={() => cycleRow(row.key, row.items, 1)}
                  className="font-pixel"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffd23e',
                    fontSize: 14,
                    cursor: 'pointer',
                    padding: '0 2px',
                  }}
                  title=" Berikutnya"
                >
                  ▶
                </button>

                {/* Tombol Aksi Kanan: Randomize untuk baris 1-3, Tombol CONFIRM di baris ke-4 */}
                {rIdx < 3 ? (
                  <button
                    onClick={() => randomizeCategory(row.key, row.items)}
                    className="pixel-btn flex items-center justify-center"
                    style={{
                      width: 112,
                      height: 64,
                      background: 'linear-gradient(to bottom, #2478dc, #1553a1)',
                      fontSize: 18,
                    }}
                    title={`Acak ${row.title}`}
                  >
                    🔄
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sfx.approve()
                      onConfirm(name.trim() || 'QA Lead')
                    }}
                    className="pixel-btn flex flex-col items-center justify-center gap-1"
                    style={{
                      width: 112,
                      height: 64,
                      background: 'linear-gradient(to bottom, #2478dc, #1553a1)',
                      border: '3px solid #000',
                      padding: 4,
                    }}
                  >
                    <span style={{ fontSize: 16, lineHeight: 1 }}>✅</span>
                    <span
                      className="font-pixel"
                      style={{
                        fontSize: 9,
                        color: '#ffffff',
                        background: '#08152c',
                        padding: '3px 6px',
                      }}
                    >
                      CONFIRM
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Status info bawah */}
          <div
            className="text-center"
            style={{
              fontSize: 17,
              color: '#93c5fd',
              background: '#050c1a',
              padding: '4px 8px',
              border: '2px solid #15386b',
            }}
          >
            {msg}
          </div>
        </div>
      </div>

      {/* ==================== PANEL KANAN: PREVIEW ==================== */}
      <div
        className="pixel-panel flex flex-col"
        style={{
          width: 340,
          height: 516,
          background: '#071124',
          border: '4px solid #000',
          boxShadow: '0 8px 0 rgba(0,0,0,0.65)',
        }}
      >
        {/* Title Bar Oranye */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            background: 'linear-gradient(to bottom, #f09436, #c96d18)',
            borderBottom: '4px solid #000',
          }}
        >
          <div className="w-6" />
          <div
            className="font-pixel text-center"
            style={{ fontSize: 13, color: '#ffffff', textShadow: '2px 2px 0 #000' }}
          >
            PREVIEW
          </div>
          <div
            className="font-pixel flex items-center justify-center"
            style={{
              width: 24,
              height: 24,
              fontSize: 10,
              background: '#c93028',
              color: '#fff',
              border: '2px solid #000',
            }}
          >
            ✕
          </div>
        </div>

        {/* Area Karakter Full Body + Glow + 3 Slot Equipped Bawah */}
        <div className="relative flex flex-1 flex-col items-center justify-between p-4">
          <div className="font-pixel" style={{ fontSize: 10, color: '#7dd3fc' }}>
            {name || 'QA Lead'}
          </div>

          {/* Karakter dengan aura neon hijau-cyan seperti referensi */}
          <div className="relative flex items-center justify-center" style={{ marginTop: 4 }}>
            <Character look={look} size={235} glow />
          </div>

          {/* 3 Kotak Dashed Item Terpasang di Bawah Kaki Karakter (persis referensi) */}
          <div className="grid w-full grid-cols-3 gap-3 pt-1">
            {[look.hair, look.eyes, activeAccId].map((iconId, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center"
                style={{
                  height: 68,
                  background: 'rgba(16, 38, 74, 0.55)',
                  border: '2px dashed #3b82f6',
                }}
              >
                <CosmeticIcon id={iconId} size={52} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
