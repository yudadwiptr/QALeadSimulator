import { useEffect, useState, useCallback } from 'react'
import { sfx } from '../game/audio.js'
import { DevAvatar, VisualEvidencePreview } from './PixelArtAssets.jsx'

function LogLine({ line }) {
  const cls = line.includes('[ERROR]') || line.includes('[FATAL]')
    ? 'log-err'
    : line.includes('[WARN]')
      ? 'log-warn'
      : 'log-ok'
  return <div className={cls}>{line}</div>
}

export default function TicketModal({ ticket, stamina, onDecide, onClose, onReadLog }) {
  const [tab, setTab] = useState('evidence')
  const [logRead, setLogRead] = useState(false)

  const isTutorial = Boolean(ticket.tutorialStep)
  const blur = isTutorial
    ? 0
    : stamina <= 5
      ? 5
      : stamina < 20
        ? 3
        : stamina < 35
          ? 1.5
          : 0

  const openTab = useCallback(
    (t) => {
      sfx.click()
      setTab(t)
      if (t === 'log' && !logRead) {
        setLogRead(true)
        onReadLog()
      }
    },
    [logRead, onReadLog],
  )

  // Keyboard shortcuts saat TicketModal terbuka
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const k = e.key.toLowerCase()
      if (k === '1') {
        e.preventDefault()
        openTab('evidence')
      } else if (k === '2' || k === 'l' || e.code === 'Space') {
        e.preventDefault()
        openTab('log')
      } else if (k === '3') {
        e.preventDefault()
        openTab('note')
      } else if (k === '4') {
        e.preventDefault()
        openTab('code')
      } else if (k === 'a') {
        e.preventDefault()
        onDecide(ticket, 'approve', logRead)
      } else if (k === 'r') {
        e.preventDefault()
        onDecide(ticket, 'reject', logRead)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openTab, onDecide, onClose, ticket, logRead])

  const ev = ticket.evidence
  const suggestLogClick = isTutorial && !logRead
  const suggestApprove = isTutorial && logRead && !ticket.buggy
  const suggestReject = isTutorial && logRead && ticket.buggy

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center p-3"
      style={{ background: 'rgba(5, 7, 14, 0.72)' }}
    >
      {/* Window Frame Biru Klasik Sesuai Referensi 2.jfif */}
      <div
        className="flex max-h-full flex-col"
        style={{
          width: 680,
          background: '#2563eb',
          border: '4px solid #000',
          padding: 4,
          boxShadow: '0 10px 0 rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.35)',
        }}
      >
        {/* Title Bar Biru dengan [_][□][✕] */}
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{
            background: ticket.critical
              ? 'linear-gradient(to right, #b91c1c, #dc2626)'
              : 'linear-gradient(to right, #1d4ed8, #3b82f6)',
            borderBottom: '3px solid #000',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16 }}>🐞</span>
            <span className="font-pixel" style={{ fontSize: 11, color: '#ffffff', textShadow: '2px 2px 0 #000' }}>
              TICKET VIEW {isTutorial && `· ${ticket.tutorialTitle}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {ticket.critical && (
              <div
                className="font-pixel blink px-2 py-0.5"
                style={{ fontSize: 10, background: '#000', color: '#ffd23e' }}
              >
                ⏰ {Math.max(0, Math.ceil(ticket.timerSec))}s
              </div>
            )}
            <div
              className="font-pixel flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                fontSize: 9,
                background: '#3b82f6',
                color: '#fff',
                border: '2px solid #000',
              }}
            >
              _
            </div>
            <div
              className="font-pixel flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                fontSize: 9,
                background: '#3b82f6',
                color: '#fff',
                border: '2px solid #000',
              }}
            >
              □
            </div>
            <button
              className="font-pixel flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                fontSize: 9,
                background: '#dc2626',
                color: '#fff',
                border: '2px solid #000',
                cursor: 'pointer',
              }}
              onClick={onClose}
              title="Tutup [Esc]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div
          className="flex flex-col gap-2.5 overflow-y-auto p-3.5"
          style={{ background: '#f1f5f9', color: '#0f172a', border: '3px solid #000' }}
        >
          {/* Banner Tutorial Terpandu (Hari 1) */}
          {isTutorial && (
            <div
              style={{
                background: logRead ? '#064e3b' : '#1e293b',
                color: '#ffffff',
                border: `3px solid ${logRead ? '#10b981' : '#f59e0b'}`,
                padding: '7px 12px',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                <span className="font-pixel" style={{ fontSize: 9, color: logRead ? '#6ee7b7' : '#fde047' }}>
                  {logRead ? '🎯 LANGKAH 2: AMBIL KEPUTUSAN' : '🧭 LANGKAH 1: CEK SUMBER KEBENARAN'}
                </span>
                <span className="font-pixel" style={{ fontSize: 8, color: '#cbd5e1' }}>
                  LOG MERAH = REJECT · LOG HIJAU = APPROVE
                </span>
              </div>
              <div style={{ fontSize: 18, lineHeight: 1.2 }}>
                {logRead ? ticket.tutorialPostLog : ticket.tutorialPreLog}
              </div>
            </div>
          )}

          {/* Header Judul Tiket ala 2.jfif ("BUG-104: Judul") */}
          <div
            className="flex items-center justify-between pb-1.5"
            style={{ borderBottom: '3px solid #cbd5e1' }}
          >
            <div>
              <div
                className="font-pixel"
                style={{ fontSize: 14, color: '#0f172a', lineHeight: 1.3 }}
              >
                {ticket.id}: {ticket.title}
              </div>
              <div style={{ fontSize: 17, color: '#475569', marginTop: 1 }}>
                📁 Modul: <b>{ticket.module}</b> · Kategori: <b>{ticket.category.toUpperCase()}</b>
                {ticket.rework && (
                  <span style={{ color: '#d97706', fontWeight: 'bold' }}> · 🔁 REWORK</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="font-pixel px-2.5 py-1"
                style={{
                  fontSize: 9,
                  background: ticket.critical ? '#dc2626' : '#f59e0b',
                  color: ticket.critical ? '#ffffff' : '#0f172a',
                  border: '2px solid #000',
                }}
              >
                {ticket.critical ? 'CRITICAL' : 'MEDIUM'}
              </span>
            </div>
          </div>

          {/* Tabs Navigasi + Hotkey Hint */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              ['evidence', '🧪 BUKTI TEST [1]'],
              ['log', '📜 SERVER LOG [Space]'],
              ['note', '💬 CATATAN DEV [3]'],
              ['code', '📄 KODE [4]'],
            ].map(([id, label]) => {
              const highlightTab = id === 'log' && suggestLogClick
              const active = tab === id
              return (
                <button
                  key={id}
                  className={`pixel-btn ${highlightTab ? 'blink' : ''}`}
                  style={{
                    fontSize: 8,
                    padding: '7px 9px',
                    background: active
                      ? '#1d4ed8'
                      : highlightTab
                        ? '#d97706'
                        : '#334155',
                    outline: highlightTab ? '3px solid #facc15' : undefined,
                  }}
                  onClick={() => openTab(id)}
                >
                  {label}
                  {highlightTab && ' ⬅ KLIK!'}
                </button>
              )
            })}
          </div>

          {/* ==================== TAB 1: BUKTI TEST + VISUAL MOCKUP ==================== */}
          {tab === 'evidence' && ev && (
            <div
              className="flex flex-col gap-2 p-3"
              style={{
                background: '#0f172a',
                color: '#f8fafc',
                border: '3px solid #000',
                fontSize: 18,
                lineHeight: 1.2,
              }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-2 pb-1"
                style={{ borderBottom: '2px solid #1e293b' }}
              >
                <span
                  className="font-pixel"
                  style={{ fontSize: 9, color: ev.allPass ? '#4ade80' : '#ff5c52' }}
                >
                  {ev.allPass ? '✅ KLAIM FORM TEST: PASS' : '❌ KLAIM FORM TEST: ADA GAGAL'}
                </span>
                <span
                  className="font-pixel px-2 py-0.5"
                  style={{
                    fontSize: 8,
                    background: ev.allPass ? '#14532d' : '#450a0a',
                    color: ev.allPass ? '#86efac' : '#fca5a5',
                    border: '1px solid #000',
                  }}
                >
                  {ev.ci}
                </span>
              </div>

              <div>
                <span style={{ color: '#94a3b8' }}>🔎 Skenario Uji: </span>
                <span style={{ color: '#f1f5f9' }}>{ev.repro}</span>
              </div>

              {/* Pratinjau Visual Side-by-Side (Expected vs Actual) */}
              <VisualEvidencePreview ticket={ticket} />

              <div className="flex flex-col gap-0.5 pt-0.5">
                {ev.checks.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      color: c.startsWith('❌') ? '#ff5c52' : '#4ade80',
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Kutipan Klaim Developer dengan Avatar */}
              <div
                className="mt-0.5 flex items-center justify-between gap-2 px-2.5 py-1.5"
                style={{
                  background: '#1e293b',
                  borderLeft: '4px solid #38bdf8',
                  fontSize: 17,
                }}
              >
                <div className="flex items-center gap-2">
                  <DevAvatar name={ticket.dev} size={22} />
                  <span style={{ color: '#e2e8f0', fontStyle: 'italic' }}>
                    <b>{ticket.dev}:</b> "{ticket.note}"
                  </span>
                </div>
                <span
                  style={{
                    color: '#fde047',
                    fontSize: 15,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚠️ Cek Log [Space]!
                </span>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: SERVER LOG ==================== */}
          {tab === 'log' && (
            <div className="log-view relative overflow-hidden" style={{ background: '#060912' }}>
              <div style={{ filter: blur ? `blur(${blur}px)` : 'none' }}>
                {ticket.log.map((l, i) => (
                  <LogLine key={i} line={l} />
                ))}
                <div style={{ color: '#475569', marginTop: 4 }}>
                  — end of server log (sumber kebenaran mutlak) —
                </div>
              </div>
              <div
                className="mt-2 flex items-center justify-between pt-2"
                style={{ borderTop: '1px solid #1e293b', fontSize: 16, color: '#94a3b8' }}
              >
                <span>🟢 Hijau [INFO] = Aman (Tekan [A] Approve)</span>
                <span>🔴 Merah [ERROR]/[FATAL] = Bahaya (Tekan [R] Reject)</span>
              </div>
              {!isTutorial && stamina <= 5 && (
                <div
                  className="absolute inset-0 flex items-center justify-center font-pixel text-center"
                  style={{
                    fontSize: 10,
                    color: '#ff5c52',
                    background: 'rgba(6,7,12,0.65)',
                    padding: 12,
                  }}
                >
                  MATA TERLALU LELAH UNTUK BACA LOG...
                  <br />
                  MINUM KOPI DULU [C] ☕
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 3: CATATAN DEV ==================== */}
          {tab === 'note' && (
            <div
              className="log-view flex flex-col gap-3"
              style={{ background: '#0f172a', color: '#e2e8f0' }}
            >
              <div className="flex items-center gap-3">
                <DevAvatar name={ticket.dev} size={36} />
                <div style={{ fontStyle: 'italic', fontSize: 21 }}>
                  <b>{ticket.dev}:</b> "{ticket.note}"
                </div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 17 }}>
                💡 <b>Tips QA Lead:</b> Catatan developer adalah sinyal sosial. Dev yang buru-buru kadang bilang <i>"aman kok bro"</i> padahal ada error di Server Log.
              </div>
              {ticket.rework && (
                <div style={{ color: '#f59e0b' }}>
                  ⚠ Tiket ini pernah kamu reject padahal bersih. Dev-nya masih ngambek.
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: DIFF KODE (OPSIONAL) ==================== */}
          {tab === 'code' && (
            <div className="flex flex-col gap-1.5">
              <div style={{ fontSize: 16, color: '#334155' }}>
                💡 <b>Opsional (Flavor Teknis):</b> Kamu tidak wajib paham kodenya. Gunakan <b>Bukti Test</b> & <b>Server Log</b> untuk mengambil keputusan.
              </div>
              <pre className="code-view m-0">{ticket.snippet}</pre>
            </div>
          )}

          {/* TOMBOL AKSI BESAR SESUAI REFERENSI 2.jfif */}
          <div className="mt-0.5 flex gap-4">
            <button
              className={`pixel-btn flex-1 ${suggestApprove ? 'blink' : ''}`}
              style={{
                fontSize: 14,
                padding: '13px 0',
                background: 'linear-gradient(to bottom, #22c55e, #15803d)',
                border: '4px solid #000',
                outline: suggestApprove ? '3px solid #facc15' : undefined,
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.35), 0 4px 0 #000',
              }}
              onClick={() => onDecide(ticket, 'approve', logRead)}
            >
              ✔ APPROVE [A] {suggestApprove && '⬅ KLIK!'}
            </button>
            <button
              className={`pixel-btn flex-1 ${suggestReject ? 'blink' : ''}`}
              style={{
                fontSize: 14,
                padding: '13px 0',
                background: 'linear-gradient(to bottom, #ef4444, #b91c1c)',
                border: '4px solid #000',
                outline: suggestReject ? '3px solid #facc15' : undefined,
                boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.35), 0 4px 0 #000',
              }}
              onClick={() => onDecide(ticket, 'reject', logRead)}
            >
              ✖ REJECT [R] {suggestReject && '⬅ KLIK!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
