import Character from './Character.jsx'
import { DevAvatar } from './PixelArtAssets.jsx'
import { ENDINGS } from '../game/data.js'
import { sfx } from '../game/audio.js'

function getQaBadge(st, acc) {
  if ((st.trapsCaught || 0) >= 3) {
    return { icon: '🕵️', title: 'DETEKTIF KEBOHONGAN DEV', color: '#38bdf8' }
  }
  if (st.badApprove === 0 && (st.maxStreak || 0) >= 5) {
    return { icon: '🛡️', title: 'PENJAGA GAWANG PRODUCTION', color: '#4ade80' }
  }
  if ((st.coffeesDrunk || 0) >= 3) {
    return { icon: '☕', title: 'MANUSIA 80% KAFEIN', color: '#f59e0b' }
  }
  if (acc >= 90) {
    return { icon: '🔥', title: 'DEWA STREAK QA', color: '#4ade80' }
  }
  if (st.badApprove >= 2) {
    return { icon: '🎲', title: 'APPROVE DULU DOA KEMUDIAN', color: '#ff5c52' }
  }
  return { icon: '🔎', title: 'QA LEAD TELITI', color: '#7dd3fc' }
}

function getTopNemesis(nemesisMap) {
  if (!nemesisMap) return null
  const entries = Object.entries(nemesisMap)
  if (!entries.length) return null
  entries.sort((a, b) => b[1] - a[1])
  return { name: entries[0][0], count: entries[0][1] }
}

export function DaySummary({ cfg, result, onNext }) {
  const st = result.stats
  const accuracyDen = st.okApprove + st.badApprove + st.okReject + st.badReject
  const correct = st.okApprove + st.badReject
  const acc = accuracyDen ? Math.round((correct / accuracyDen) * 100) : 100
  const badge = getQaBadge(st, acc)
  const nemesis = getTopNemesis(st.nemesisMap)

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-4 p-6 crt"
      style={{
        background: 'radial-gradient(circle at center, #132342 0%, #090c14 100%)',
      }}
    >
      <div
        className="font-pixel"
        style={{ fontSize: 20, color: '#4ade80', textShadow: '3px 3px 0 #000' }}
      >
        ✔ DAY {cfg.day} ({cfg.name.toUpperCase()}) SELESAI — 17:00 WIB
      </div>

      {/* Gelar Hari Ini */}
      <div
        className="pixel-panel flex items-center gap-3 px-5 py-2"
        style={{ background: '#0b1528', borderColor: badge.color }}
      >
        <span style={{ fontSize: 24 }}>{badge.icon}</span>
        <div>
          <div className="font-pixel" style={{ fontSize: 7, color: '#94a3b8' }}>
            GELAR SHIFT HARI INI
          </div>
          <div className="font-pixel mt-0.5" style={{ fontSize: 11, color: badge.color }}>
            {badge.title}
          </div>
        </div>
      </div>

      <div
        className="pixel-panel flex flex-col gap-2 p-5"
        style={{ fontSize: 21, minWidth: 490, background: '#0e172a' }}
      >
        <Row k="Tiket di-handle benar" v={`${correct}`} good />
        <Row k="🔥 Max Streak Berturut-turut" v={`${st.maxStreak || 0}x`} good={(st.maxStreak || 0) >= 3} />
        <Row k="🎯 Jebakan Dev Bohong Tertangkap" v={`${st.trapsCaught || 0}`} good={(st.trapsCaught || 0) > 0} />
        <Row k="Bug lolos ke prod (salah approve)" v={`${st.badApprove}`} bad={st.badApprove > 0} />
        <Row k="Tiket bersih ditolak (dev ngambek)" v={`${st.okReject}`} bad={st.okReject > 0} />
        <Row k="Critical meledak" v={`${st.exploded}`} bad={st.exploded > 0} />
        <Row k="Akurasi QA" v={`${acc}%`} good={acc >= 80} />
        <Row
          k="Server Health"
          v={`${Math.ceil(result.health)}%`}
          good={result.health > 50}
          bad={result.health <= 30}
        />
        <Row k="QA Coins" v={`🪙 ${result.coins.toLocaleString('id-ID')}`} />

        {nemesis && (
          <div
            className="mt-1 flex items-center justify-between pt-2"
            style={{ borderTop: '2px solid #1e293b' }}
          >
            <span style={{ color: '#facc15' }}>🤥 Dev Paling Sering Bikin Ulah:</span>
            <span className="flex items-center gap-2" style={{ color: '#f8fafc', fontWeight: 'bold' }}>
              <DevAvatar name={nemesis.name} size={22} />
              {nemesis.name} ({nemesis.count} tiket bermasalah)
            </span>
          </div>
        )}
      </div>

      <div style={{ color: '#94a3b8', fontSize: 19 }}>
        🔧 Tim Ops menambal server semalam: <b style={{ color: '#4ade80' }}>+25% Server Health</b> besok pagi.
      </div>

      <button
        className="pixel-btn btn-blue"
        style={{ fontSize: 13, padding: '14px 28px' }}
        onClick={() => {
          sfx.click()
          onNext()
        }}
      >
        😴 PULANG & LANJUT → DAY {cfg.day + 1}
      </button>
    </div>
  )
}

function Row({ k, v, good, bad }) {
  return (
    <div className="flex items-center justify-between gap-10">
      <span style={{ color: '#94a3b8' }}>{k}</span>
      <span style={{ color: bad ? '#ff5c52' : good ? '#4ade80' : '#f8fafc' }}>{v}</span>
    </div>
  )
}

export function EndingScreen({ endingId, look, name, result, onRestart }) {
  const e = ENDINGS[endingId]
  const palette = {
    good: '#4ade80',
    fired: '#ff5c52',
    overtime: '#f59e0b',
  }
  const st = result?.stats || {}
  const accuracyDen = (st.okApprove || 0) + (st.badApprove || 0) + (st.okReject || 0) + (st.badReject || 0)
  const correct = (st.okApprove || 0) + (st.badReject || 0)
  const acc = accuracyDen ? Math.round((correct / accuracyDen) * 100) : 100
  const badge = getQaBadge(st, acc)
  const nemesis = getTopNemesis(st.nemesisMap)

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-5 p-6 crt"
      style={{
        background: 'radial-gradient(circle at center, #141c30 0%, #07090e 100%)',
      }}
    >
      <div
        className="font-pixel text-center"
        style={{ fontSize: 24, color: palette[endingId], textShadow: '3px 3px 0 #000' }}
      >
        {e.emoji} {endingId === 'good' ? 'GOOD ENDING' : 'BAD ENDING'}: {e.title}
      </div>

      {/* Kartu ID Raport Akhir QA Lead */}
      <div
        className="pixel-panel flex items-center gap-6 p-6"
        style={{ width: 680, background: '#0b1324', border: `4px solid ${palette[endingId]}` }}
      >
        <div
          className="pixel-panel flex flex-col items-center justify-center p-3"
          style={{ width: 180, background: '#060a14' }}
        >
          <Character
            look={look}
            size={140}
            glow={endingId === 'good'}
            style={{
              filter:
                endingId === 'fired'
                  ? 'grayscale(1) brightness(0.8)'
                  : endingId === 'overtime'
                    ? 'sepia(0.45) brightness(0.85)'
                    : 'none',
            }}
          />
          <div className="font-pixel mt-2 truncate" style={{ fontSize: 9, color: '#f8fafc' }}>
            {name}
          </div>
          <div className="font-pixel mt-1" style={{ fontSize: 7, color: badge.color }}>
            {badge.icon} {badge.title}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <p style={{ fontSize: 21, color: '#e2e8f0', lineHeight: 1.25, margin: 0 }}>{e.text}</p>

          {result && (
            <div
              className="grid grid-cols-2 gap-2 p-3"
              style={{ background: '#060a14', border: '2px solid #1e293b', fontSize: 18 }}
            >
              <div>
                🖥 Server Health: <b style={{ color: palette[endingId] }}>{Math.ceil(result.health)}%</b>
              </div>
              <div>
                🎯 Akurasi Review: <b style={{ color: '#4ade80' }}>{acc}%</b>
              </div>
              <div>
                🔥 Max Streak: <b style={{ color: '#ffd23e' }}>{st.maxStreak || 0}x</b>
              </div>
              <div>
                🕵️ Jebakan Tertangkap: <b style={{ color: '#38bdf8' }}>{st.trapsCaught || 0}</b>
              </div>
              <div>
                🪙 Saldo Akhir: <b style={{ color: '#ffd23e' }}>{result.coins.toLocaleString('id-ID')}</b>
              </div>
              {nemesis && (
                <div className="flex items-center gap-1.5">
                  <span>🤥 Musuh Utama:</span>
                  <DevAvatar name={nemesis.name} size={18} />
                  <b style={{ color: '#ff5c52' }}>{nemesis.name}</b>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        className="pixel-btn btn-green"
        style={{ fontSize: 13, padding: '14px 28px' }}
        onClick={() => {
          sfx.approve()
          onRestart()
        }}
      >
        ↻ MAIN LAGI (ITEM SHOP TETAP TERSIMPAN)
      </button>
    </div>
  )
}
