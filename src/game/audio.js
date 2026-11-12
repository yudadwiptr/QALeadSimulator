// SFX + BGM prosedural via WebAudio (tanpa file audio)
let ctx = null
let muted = false
let bgm = { timer: null, tempo: 'calm', gain: null }

function ac() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch {
      ctx = null
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

export function setMuted(m) {
  muted = m
  if (bgm.gain) bgm.gain.gain.value = m ? 0 : 0.05
}
export function isMuted() {
  return muted
}

function blip({ freq = 440, dur = 0.08, type = 'square', vol = 0.12, slide = 0 }) {
  const c = ac()
  if (!c || muted) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, c.currentTime)
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), c.currentTime + dur)
  g.gain.setValueAtTime(vol, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  o.connect(g).connect(c.destination)
  o.start()
  o.stop(c.currentTime + dur + 0.02)
}

export const sfx = {
  click: () => blip({ freq: 700, dur: 0.05, vol: 0.07 }),
  open: () => blip({ freq: 500, dur: 0.07, vol: 0.08, slide: 200 }),
  approve: () => {
    blip({ freq: 523, dur: 0.09 })
    setTimeout(() => blip({ freq: 784, dur: 0.12 }), 80
    )
  },
  reject: () => blip({ freq: 180, dur: 0.18, type: 'sawtooth', vol: 0.1, slide: -80 }),
  error: () => {
    blip({ freq: 196, dur: 0.25, type: 'sawtooth', vol: 0.16, slide: -60 })
    setTimeout(() => blip({ freq: 147, dur: 0.3, type: 'sawtooth', vol: 0.16, slide: -50 }), 180)
  },
  alarm: () => {
    blip({ freq: 880, dur: 0.12, type: 'square', vol: 0.1 })
    setTimeout(() => blip({ freq: 660, dur: 0.12, type: 'square', vol: 0.1 }), 140)
  },
  coffee: () => {
    blip({ freq: 300, dur: 0.1, type: 'triangle', vol: 0.12, slide: 250 })
    setTimeout(() => blip({ freq: 520, dur: 0.15, type: 'triangle', vol: 0.1, slide: 150 }), 110)
  },
  cash: () => {
    blip({ freq: 1047, dur: 0.07, vol: 0.09 })
    setTimeout(() => blip({ freq: 1319, dur: 0.1, vol: 0.09 }), 70)
  },
  notif: () => blip({ freq: 988, dur: 0.06, type: 'sine', vol: 0.08 }),
}

// ---- BGM: loop chord lo-fi sederhana ----
const CALM = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [196.0, 246.94, 293.66], // G... pakai triad santai
  [164.81, 220.0, 261.63], // Am/E
]
const PANIC = [
  [220.0, 261.63, 311.13],
  [207.65, 246.94, 311.13],
  [196.0, 233.08, 293.66],
  [185.0, 220.0, 277.18],
]

function playChord(freqs, durSec) {
  const c = ac()
  if (!c) return
  const master = c.createGain()
  master.gain.value = muted ? 0 : 0.045
  master.connect(c.destination)
  bgm.gain = master
  freqs.forEach((f, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'triangle'
    o.frequency.value = f / 2
    g.gain.setValueAtTime(0.0001, c.currentTime)
    g.gain.linearRampToValueAtTime(0.9 / (i + 1), c.currentTime + 0.3)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + durSec)
    o.connect(g).connect(master)
    o.start()
    o.stop(c.currentTime + durSec + 0.1)
  })
}

export function startBgm(tempo = 'calm') {
  stopBgm()
  bgm.tempo = tempo
  const step = tempo === 'panic' ? 1400 : 2800
  const prog = tempo === 'panic' ? PANIC : CALM
  let i = 0
  const tick = () => {
    playChord(prog[i % prog.length], step / 1000 + 0.4)
    i++
  }
  tick()
  bgm.timer = setInterval(tick, step)
}

export function stopBgm() {
  if (bgm.timer) clearInterval(bgm.timer)
  bgm.timer = null
}
