import { sfx } from '../game/audio.js'

export default function TitleScreen({ onStart }) {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden p-6 crt"
      style={{
        backgroundImage: 'url(/assets/title_art.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Vignette & Dark Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(10,14,28,0.52) 0%, rgba(5,7,14,0.88) 100%)',
        }}
      />

      {/* TOP BAR: REC Indicator (seperti reference/1.jfif) + Build Version */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className="pixel-panel flex items-center gap-3 px-3.5 py-2"
          style={{ background: 'rgba(10, 14, 24, 0.9)', borderColor: '#000' }}
        >
          <span
            className="blink inline-block"
            style={{
              width: 12,
              height: 12,
              background: '#ef4444',
              boxShadow: '0 0 8px #ef4444',
            }}
          />
          <span className="font-pixel" style={{ fontSize: 12, color: '#4ade80', letterSpacing: 1 }}>
            QA LEAD CAM · LIVE
          </span>
        </div>

        <div
          className="pixel-panel px-3 py-1.5 font-pixel"
          style={{ fontSize: 9, background: 'rgba(10, 14, 24, 0.85)', color: '#93c5fd' }}
        >
          🖥️ PROD SERVER: ONLINE (100%)
        </div>
      </div>

      {/* CENTER HERO: Judul 3D Pixel + Golden Rules Card */}
      <div className="relative z-10 my-auto flex flex-col items-center gap-5 text-center">
        {/* Banner Logo seperti di atas monitor reference/2.jfif */}
        <div
          className="pixel-panel px-8 py-5"
          style={{
            background: 'linear-gradient(to bottom, #1e2d52, #0f172a)',
            border: '4px solid #000',
            boxShadow: '0 8px 0 rgba(0,0,0,0.7), inset 0 3px 0 rgba(255,255,255,0.18)',
          }}
        >
          <div
            className="font-pixel mb-2"
            style={{ fontSize: 10, color: '#7dd3fc', letterSpacing: 3 }}
          >
            ★ SIMULASI KEHIDUPAN QA LEAD ★
          </div>
          <h1
            className="font-pixel m-0 leading-tight"
            style={{
              fontSize: 38,
              color: '#f8fafc',
              textShadow: '4px 4px 0 #000, -2px -2px 0 #1e3a8a',
            }}
          >
            RELEASE DAY
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4">
            <div style={{ height: 4, width: 52, background: '#64748b' }} />
            <span
              className="font-pixel"
              style={{
                fontSize: 28,
                color: '#ef4444',
                textShadow: '4px 4px 0 #000',
                letterSpacing: 3,
              }}
            >
              SURVIVAL
            </span>
            <div style={{ height: 4, width: 52, background: '#64748b' }} />
          </div>
        </div>

        <p
          style={{
            maxWidth: 640,
            fontSize: 23,
            color: '#e2e8f0',
            textShadow: '2px 2px 0 #000',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Lima hari menuju rilis besar. Ratusan tiket masuk. Developer yang ngotot{' '}
          <span style={{ color: '#ffd23e' }}>
            <i>"udah di-test di local, aman kok bro!"</i>
          </span>{' '}
          — padahal server production siap meledak.
        </p>

        {/* 3 Aturan Emas QA Lead */}
        <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 740 }}>
          <div
            className="pixel-panel flex flex-col gap-1 p-3 text-left"
            style={{ background: 'rgba(13, 21, 38, 0.92)' }}
          >
            <div className="font-pixel" style={{ fontSize: 9, color: '#7dd3fc' }}>
              1. CEK BUKTI TEST 🧪
            </div>
            <div style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.15 }}>
              Bandingkan <b>Expected vs Actual</b> dan checklist hasil test tanpa wajib hafal kodingan.
            </div>
          </div>

          <div
            className="pixel-panel flex flex-col gap-1 p-3 text-left"
            style={{ background: 'rgba(13, 21, 38, 0.92)' }}
          >
            <div className="font-pixel" style={{ fontSize: 9, color: '#4ade80' }}>
              2. LOG SELALU JUJUR 📜
            </div>
            <div style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.15 }}>
              <span style={{ color: '#4ade80' }}>Hijau [INFO] = Approve</span>.{' '}
              <span style={{ color: '#ff5c52' }}>Merah [ERROR] = Reject</span>. Sesimpel itu!
            </div>
          </div>

          <div
            className="pixel-panel flex flex-col gap-1 p-3 text-left"
            style={{ background: 'rgba(13, 21, 38, 0.92)' }}
          >
            <div className="font-pixel" style={{ fontSize: 9, color: '#ffd23e' }}>
              3. AWAS DEV BOHONG 🤥
            </div>
            <div style={{ fontSize: 18, color: '#cbd5e1', lineHeight: 1.15 }}>
              Dev yang dikejar deadline bisa memalsukan centang ✅ test. Selalu cross-check Server Log!
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="pixel-btn btn-green mt-1"
          style={{
            fontSize: 16,
            padding: '16px 36px',
            border: '4px solid #000',
            boxShadow: '0 6px 0 #000, inset 0 3px 0 rgba(255,255,255,0.35)',
          }}
          onClick={() => {
            sfx.approve()
            onStart()
          }}
        >
          ▶ MULAI SPRINT (SENIN–JUMAT)
        </button>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 flex items-center justify-between" style={{ fontSize: 18, color: '#94a3b8' }}>
        <span>☕ Tip: Minum kopi saat mata mulai buram · Beli outfit & alat bantu di QA Shop</span>
        <div className="flex items-center gap-4">
          <span>Shift 09:00 – 17:00 WIB</span>
          <span>·</span>
          <a
            href="https://yumastudio.digital/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel"
            style={{
              fontSize: 9,
              color: '#7dd3fc',
              textDecoration: 'none',
              background: 'rgba(10, 14, 24, 0.85)',
              padding: '5px 10px',
              border: '2px solid #1e3a8a',
            }}
          >
            Build by yumastudio.digital ↗
          </a>
        </div>
      </div>
    </div>
  )
}
