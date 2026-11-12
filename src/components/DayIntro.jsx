import Character from './Character.jsx'
import { sfx } from '../game/audio.js'

export default function DayIntro({ cfg, look, name, health, coins, onStart }) {
  const isReleaseDay = cfg.day === 5
  return (
    <div
      className="flex h-full flex-col items-center justify-center p-6 crt"
      style={{
        background: isReleaseDay
          ? 'radial-gradient(circle at center, #331016 0%, #090b12 100%)'
          : 'radial-gradient(circle at center, #14223d 0%, #090c14 100%)',
      }}
    >
      <div
        className="pixel-panel flex flex-col"
        style={{
          width: 720,
          background: '#0b1426',
          border: '4px solid #000',
          boxShadow: '0 8px 0 rgba(0,0,0,0.65)',
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{
            background: isReleaseDay
              ? 'linear-gradient(to bottom, #dc2626, #991b1b)'
              : 'linear-gradient(to bottom, #2563eb, #1d4ed8)',
            borderBottom: '4px solid #000',
          }}
        >
          <div className="font-pixel" style={{ fontSize: 11, color: '#ffd23e' }}>
            📅 MORNING STANDUP BRIEFING — SPRINT DAY {cfg.day}/5
          </div>
          <div className="font-pixel" style={{ fontSize: 9, color: '#ffffff' }}>
            08:55 AM
          </div>
        </div>

        {/* Body */}
        <div className="flex items-center gap-6 p-6">
          {/* Kartu Karakter */}
          <div
            className="pixel-panel flex flex-col items-center justify-center p-4"
            style={{ width: 220, background: '#070d19', border: '3px solid #1e3a8a' }}
          >
            <Character look={look} size={175} glow />
            <div className="font-pixel mt-2 truncate" style={{ fontSize: 10, color: '#7dd3fc' }}>
              {name}
            </div>
            <div style={{ fontSize: 17, color: '#94a3b8' }}>QA Lead · Shift Pagi</div>
          </div>

          {/* Info Hari & Tantangan */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center justify-between">
              <div
                className="font-pixel"
                style={{ fontSize: 24, color: '#f8fafc', textShadow: '3px 3px 0 #000' }}
              >
                DAY {cfg.day}: {cfg.name.toUpperCase()}
              </div>
              <span
                className="font-pixel px-2.5 py-1"
                style={{
                  fontSize: 9,
                  background: isReleaseDay ? '#dc2626' : '#f59e0b',
                  color: isReleaseDay ? '#fff' : '#000',
                  border: '2px solid #000',
                }}
              >
                {cfg.label}
              </span>
            </div>

            <div
              className="pixel-panel p-3.5"
              style={{
                background: '#111c33',
                fontSize: 21,
                color: '#e2e8f0',
                lineHeight: 1.25,
                borderLeft: '4px solid #38bdf8',
              }}
            >
              "{cfg.intro}"
            </div>

            {/* Indikator Risiko Hari Ini */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="pixel-panel p-2.5" style={{ background: '#070d19' }}>
                <div className="font-pixel" style={{ fontSize: 7, color: '#94a3b8' }}>
                  LAJU TIKET
                </div>
                <div style={{ fontSize: 19, color: '#7dd3fc', marginTop: 2 }}>
                  Tiap {(cfg.spawnIntervalMs / 1000).toFixed(1)} dtk
                </div>
              </div>
              <div className="pixel-panel p-2.5" style={{ background: '#070d19' }}>
                <div className="font-pixel" style={{ fontSize: 7, color: '#94a3b8' }}>
                  POTENSI DEV BOHONG
                </div>
                <div style={{ fontSize: 19, color: '#ffd23e', marginTop: 2 }}>
                  {Math.round(cfg.deceptiveChance * 100)}% tiket bug
                </div>
              </div>
              <div className="pixel-panel p-2.5" style={{ background: '#070d19' }}>
                <div className="font-pixel" style={{ fontSize: 7, color: '#94a3b8' }}>
                  TIKET CRITICAL
                </div>
                <div
                  style={{
                    fontSize: 19,
                    color: cfg.criticalChance > 0 ? '#ff5c52' : '#4ade80',
                    marginTop: 2,
                  }}
                >
                  {cfg.criticalChance > 0 ? `Ada (${cfg.criticalTimerSec}s timer)` : 'Aman (0%)'}
                </div>
              </div>
            </div>

            {/* Status Saat Ini */}
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ background: '#070d19', border: '2px solid #1e293b', fontSize: 19 }}
            >
              <span>
                🖥 Server Health:{' '}
                <b style={{ color: health > 50 ? '#4ade80' : '#ff5c52' }}>{Math.ceil(health)}%</b>
              </span>
              <span>
                🪙 Saldo: <b style={{ color: '#ffd23e' }}>{coins.toLocaleString('id-ID')}</b>
              </span>
            </div>

            <button
              className="pixel-btn btn-green mt-1 w-full"
              style={{ fontSize: 14, padding: '14px 20px' }}
              onClick={() => {
                sfx.approve()
                onStart()
              }}
            >
              ▶ MULAI SHIFT (09:00 WIB)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
