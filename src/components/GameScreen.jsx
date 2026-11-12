import { useEffect, useRef, useState, useCallback } from 'react'
import { makeTicket, makeTutorialTickets, WORK_END } from '../game/data.js'
import { sfx, startBgm, stopBgm } from '../game/audio.js'
import Character from './Character.jsx'
import TicketModal from './TicketModal.jsx'
import Shop from './Shop.jsx'
import {
  DeskCookie,
  DeskKeyboardAndMouse,
  DevAvatar,
} from './PixelArtAssets.jsx'

const TICK = 0.2 // detik per tick

function fmtClock(gameMin) {
  const h = Math.floor(gameMin / 60)
  const m = Math.floor(gameMin % 60)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

let feedId = 1

const AMBIENT_TODOS = [
  { id: 'DEV-88', title: 'Refactor Auth Token', dev: 'Dewi', tag: 'MEDIUM' },
  { id: 'DEV-89', title: 'Update Payment SDK', dev: 'Fajar', tag: 'MEDIUM' },
  { id: 'DEV-92', title: 'Optimize Cart Query', dev: 'Agus', tag: 'CRITICAL' },
]

const AMBIENT_INPROG = [
  { id: 'DEV-90', title: 'Fix Promo Banner', dev: 'Putri', tag: 'MEDIUM' },
  { id: 'DEV-91', title: 'Sync Redis Session', dev: 'Maya', tag: 'MEDIUM' },
]

const OFFICE_EVENTS = [
  {
    id: 'pm_bribe',
    title: '📞 INTERUPSI PM: "JALUR ORANG DALAM"',
    dev: 'Budi',
    desc: 'PM berbisik di mejamu: "Bro, fitur titipan bos nih. Langsung loloskan aja ya tanpa cek log, nih uang kopi +120🪙!"',
  },
  {
    id: 'snack_treat',
    title: '🍩 TRAKTIRAN PANTRY SORE!',
    dev: 'Sinta',
    desc: 'Anak Frontend baru gajian dan traktir gorengan hangat + es kopi susu gula aren di meja tengah!',
  },
  {
    id: 'docker_stuck',
    title: '🐳 ALERT: CONTAINER STAGING NYANGKUT!',
    dev: 'Raka',
    desc: 'Docker staging macet! Klik tombol RESTART 3x cepat supaya pipeline lancar & dapat bonus +65🪙!',
  },
]

// Bar bersegmen ala LED di reference/2.jfif
function SegmentedBar({ pct, total = 18, mode = 'health' }) {
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * total)
  return (
    <div
      className="flex items-center gap-0.5 p-1"
      style={{
        background: '#090d16',
        border: '3px solid #000',
        boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.8)',
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const on = i < filled
        let color = '#1e293b'
        if (on) {
          if (mode === 'stamina') {
            color = pct < 25 ? '#ef4444' : '#38bdf8'
          } else {
            color = i >= total * 0.72 ? '#facc15' : pct <= 30 ? '#ef4444' : '#22c55e'
          }
        }
        return (
          <div
            key={i}
            style={{
              height: mode === 'stamina' ? 12 : 16,
              flex: 1,
              background: color,
              border: '1px solid #05070c',
            }}
          />
        )
      })}
    </div>
  )
}

export default function GameScreen({
  cfg,
  look,
  setLook,
  unlocked = [],
  onUnlockItem,
  name,
  startHealth,
  startCoins,
  onFinish,
}) {
  const sim = useRef(null)
  if (!sim.current) {
    const initialTickets =
      cfg.day === 1 ? makeTutorialTickets() : [makeTicket(cfg), makeTicket(cfg)]
    sim.current = {
      t: 0,
      health: startHealth,
      stamina: 100,
      coins: startCoins,
      tickets: initialTickets,
      doneTickets: [],
      pendingRework: [],
      spawnAcc: 0,
      botAcc: 0,
      coffeeCd: 0,
      streak: 0,
      eventStage: 0, // 0 -> belum, 1 -> event siang lewat, 2 -> event sore lewat
      buffs: { sirenUntil: -1, flowUntil: -1, shield: 0, qabotUntil: -1, autofix: 0 },
      stats: {
        okApprove: 0,
        badApprove: 0,
        okReject: 0,
        badReject: 0,
        exploded: 0,
        maxStreak: 0,
        trapsCaught: 0,
        coffeesDrunk: 0,
        nemesisMap: {},
      },
      done: 0,
      annoy: 0,
      feed: [
        {
          id: 0,
          dev: 'Sinta',
          text:
            cfg.day === 1
              ? `Pagi ${name}! Selesaikan 3 tiket latihan di kolom QA dulu ya.`
              : `Shift ${cfg.name} dimulai. Shortcut: [Space] Buka Tiket/Log, [A] Approve, [R] Reject, [C] Kopi!`,
          color: '#93c5fd',
        },
      ],
      finished: false,
    }
  }

  const [, setFrame] = useState(0)
  const [openTicket, setOpenTicket] = useState(null)
  const [shopOpen, setShopOpen] = useState(false)
  const [officeEvent, setOfficeEvent] = useState(null) // { ...event, clicks: 0, timerSec: 10 }
  const [fx, setFx] = useState('')
  const [feedback, setFeedback] = useState(null)
  const feedbackTimerRef = useRef(null)
  const openTicketRef = useRef(null)
  openTicketRef.current = openTicket
  const shopRef = useRef(false)
  shopRef.current = shopOpen
  const eventRef = useRef(null)
  eventRef.current = officeEvent

  const showFeedback = (text, type = 'error') => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current)
    setFeedback({ text, type })
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null)
    }, 5200)
  }

  const pushFeed = (text, color = '#e2e8f0', dev = null) => {
    const s = sim.current
    s.feed = [{ id: feedId++, text, color, dev }, ...s.feed].slice(0, 7)
  }

  const damage = (dmg, why, dev = 'Budi') => {
    const s = sim.current
    s.health = Math.max(0, s.health - dmg)
    pushFeed(`💥 -${dmg}% Server Health! ${why}`, '#ff5c52', dev)
    setFx('shake flash-red')
    setTimeout(() => setFx(''), 500)
  }

  const recordNemesis = (devName) => {
    if (!devName) return
    const map = sim.current.stats.nemesisMap
    map[devName] = (map[devName] || 0) + 1
  }

  const finish = useCallback(
    (result) => {
      const s = sim.current
      if (s.finished) return
      s.finished = true
      stopBgm()
      onFinish({
        result,
        health: s.health,
        coins: s.coins,
        stats: s.stats,
        done: s.done,
        queueLen: s.tickets.length + s.pendingRework.length,
      })
    },
    [onFinish],
  )

  const drinkCoffee = useCallback(() => {
    const st = sim.current
    if (st.coffeeCd > 0) return
    st.coffeeCd = 15
    st.stamina = Math.min(100, st.stamina + 40)
    st.stats.coffeesDrunk++
    sfx.coffee()
    pushFeed('☕ Seruput kopi hangat... fokus kembali (+40 stamina)', '#fde047')
    setFrame((f) => f + 1)
  }, [])

  // Shortcut keyboard global (C untuk kopi, Space/Enter untuk buka tiket teratas, S untuk Shop)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const k = e.key.toLowerCase()
      if (k === 'c') {
        e.preventDefault()
        drinkCoffee()
      } else if (!openTicketRef.current && !shopRef.current && (e.code === 'Space' || e.key === 'Enter')) {
        const top = sim.current.tickets[0]
        if (top) {
          e.preventDefault()
          sfx.open()
          setOpenTicket(top)
        }
      } else if (!openTicketRef.current && k === 's') {
        e.preventDefault()
        sfx.click()
        setShopOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [drinkCoffee])

  // ---------- GAME LOOP ----------
  useEffect(() => {
    const iv = setInterval(() => {
      const s = sim.current
      if (s.finished || shopRef.current) return

      const hasTutorialInQueue = s.tickets.some((t) => t.tutorialStep)
      const isReadingTutorial = Boolean(openTicketRef.current?.tutorialStep)

      if (!hasTutorialInQueue) {
        s.t += TICK
      }
      const gameMin = 9 * 60 + (s.t / cfg.durationSec) * 480

      if (gameMin >= WORK_END) {
        finish('survived')
        return
      }

      // Trigger Mid-Shift Office Drama Event (jam 11:30 dan 14:45)
      if (!hasTutorialInQueue && !eventRef.current) {
        if (s.eventStage === 0 && gameMin >= 11 * 60 + 30) {
          s.eventStage = 1
          const ev = OFFICE_EVENTS[Math.floor(Math.random() * OFFICE_EVENTS.length)]
          sfx.notif()
          setOfficeEvent({ ...ev, clicks: 0, timerSec: 11 })
        } else if (s.eventStage === 1 && gameMin >= 14 * 60 + 45) {
          s.eventStage = 2
          const ev = OFFICE_EVENTS[(cfg.day + 1) % OFFICE_EVENTS.length]
          sfx.notif()
          setOfficeEvent({ ...ev, clicks: 0, timerSec: 11 })
        }
      }

      // Countdown timer untuk Office Event
      if (eventRef.current) {
        const nextTimer = eventRef.current.timerSec - TICK
        if (nextTimer <= 0) {
          setOfficeEvent(null)
        } else {
          setOfficeEvent((prev) => (prev ? { ...prev, timerSec: nextTimer } : null))
        }
      }

      if (!hasTutorialInQueue) {
        s.spawnAcc += TICK * 1000
        if (s.spawnAcc >= cfg.spawnIntervalMs) {
          s.spawnAcc = 0
          if (s.tickets.length < 10) {
            const t = makeTicket(cfg)
            s.tickets = [...s.tickets, t]
            if (t.critical) {
              sfx.alarm()
              pushFeed(`🚨 ${t.id} CRITICAL masuk ke kolom QA! (${t.timerSec}s)`, '#ff5c52', t.dev)
            } else {
              sfx.notif()
            }
          } else {
            pushFeed('📥 Kolom QA penuh! Dev menahan tiket...', '#facc15', 'Raka')
          }
        }
      }

      // rework kembali
      const due = s.pendingRework.filter((r) => r.at <= s.t)
      if (due.length) {
        s.pendingRework = s.pendingRework.filter((r) => r.at > s.t)
        due.forEach((r) => {
          s.tickets = [...s.tickets, r.ticket]
          pushFeed(
            `🔁 ${r.ticket.id} balik ke kolom QA (masih bersih, masih ngambek)`,
            '#facc15',
            r.ticket.dev,
          )
        })
      }

      // timer critical
      for (const t of s.tickets) {
        if (t.timerSec != null) t.timerSec -= TICK
      }
      const exploded = s.tickets.filter((t) => t.timerSec != null && t.timerSec <= 0)
      if (exploded.length) {
        s.tickets = s.tickets.filter((t) => !(t.timerSec != null && t.timerSec <= 0))
        exploded.forEach((t) => {
          s.stats.exploded++
          s.streak = 0
          recordNemesis(t.dev)
          sfx.error()
          damage(18, `${t.id} meledak karena timer habis!`, t.dev)
          showFeedback(`💥 TERLAMBAT! Timer ${t.id} habis sebelum sempat di-reject! (Streak Reset)`, 'error')
          if (openTicketRef.current?.id === t.id) setOpenTicket(null)
        })
      }

      // stamina (Flow State atau Siren Coffee membuat stamina kebal)
      const sirenOn = s.t < s.buffs.sirenUntil
      const flowOn = s.t < s.buffs.flowUntil
      if (sirenOn || flowOn) {
        s.stamina = 100
      } else if (openTicketRef.current && !isReadingTutorial) {
        s.stamina = Math.max(0, s.stamina - 2.2 * TICK)
      } else {
        s.stamina = Math.min(100, s.stamina + 1.5 * TICK)
      }

      // QA Bot
      if (s.t < s.buffs.qabotUntil) {
        s.botAcc += TICK
        if (s.botAcc >= 6 && s.tickets.length) {
          s.botAcc = 0
          const t = s.tickets[0]
          s.tickets = s.tickets.slice(1)
          s.done++
          s.coins += 15
          s.doneTickets = [
            { id: t.id, title: t.title, dev: t.dev, status: t.buggy ? 'REJECTED' : 'APPROVED' },
            ...s.doneTickets,
          ].slice(0, 6)
          pushFeed(
            `🤖 QA BOT ${t.buggy ? 'me-reject' : 'meng-approve'} ${t.id}. +15🪙`,
            '#7dd3fc',
          )
          sfx.notif()
          if (openTicketRef.current?.id === t.id) setOpenTicket(null)
        }
      }

      if (s.coffeeCd > 0) s.coffeeCd -= TICK

      if (s.health <= 0) {
        finish('fired')
        return
      }

      setFrame((f) => f + 1)
    }, TICK * 1000)
    return () => clearInterval(iv)
  }, [cfg, finish])

  // ---------- BGM ----------
  const s = sim.current
  const criticals = s.tickets.filter((t) => t.critical).length
  const panic = cfg.day === 5 || criticals >= 2 || s.health < 30
  useEffect(() => {
    startBgm(panic ? 'panic' : 'calm')
    return () => stopBgm()
  }, [panic])

  const skipTutorial = () => {
    const st = sim.current
    sfx.click()
    st.tickets = [makeTicket(cfg), makeTicket(cfg)]
    setOpenTicket(null)
    pushFeed('⏭ Tutorial dilewati. Shift Senin resmi berjalan!', '#7dd3fc', 'Sinta')
    setFrame((f) => f + 1)
  }

  // Handler untuk Mid-Shift Office Event
  const handleOfficeEventAction = (choice) => {
    const st = sim.current
    if (!officeEvent) return

    if (officeEvent.id === 'pm_bribe') {
      if (choice === 'accept') {
        st.coins += 120
        if (Math.random() < 0.5) {
          sfx.error()
          damage(12, 'Titipan PM ternyata bug parah di production!', 'Budi')
          showFeedback('🤑 Kamu terima +120🪙 dari PM, tapi fiturnya meledak di prod (-12% Health)!', 'warn')
        } else {
          sfx.cash()
          showFeedback('🤑 Hoki! Titipan PM aman & kamu mengantongi +120🪙!', 'good')
        }
      } else {
        sfx.approve()
        st.coins += 35
        st.health = Math.min(100, st.health + 5)
        pushFeed('🛡️ Menolak suap PM! Standar QA terjaga (+5% Server Health, +35🪙)', '#4ade80', 'Sinta')
        showFeedback('🛡️ Integritas Tinggi! Kamu menolak jalur dalam (+5% Health & +35🪙)!', 'good')
      }
      setOfficeEvent(null)
    } else if (officeEvent.id === 'snack_treat') {
      sfx.coffee()
      st.stamina = Math.min(100, st.stamina + 60)
      st.coins += 40
      pushFeed('🍩 Gorengan & es kopi susu disikat! (+60 Stamina, +40🪙)', '#4ade80', 'Sinta')
      showFeedback('🍩 Mantap! Stamina +60 & dapat rezeki +40🪙!', 'good')
      setOfficeEvent(null)
    } else if (officeEvent.id === 'docker_stuck') {
      sfx.click()
      const nextClicks = officeEvent.clicks + 1
      if (nextClicks >= 3) {
        sfx.cash()
        st.coins += 65
        st.health = Math.min(100, st.health + 5)
        pushFeed('🐳 Docker Staging berhasil di-restart! (+5% Health, +65🪙)', '#38bdf8', 'Raka')
        showFeedback('🐳 Container Staging kembali normal! Bonus +65🪙 & +5% Server Health!', 'good')
        setOfficeEvent(null)
      } else {
        setOfficeEvent({ ...officeEvent, clicks: nextClicks })
      }
    }
    setFrame((f) => f + 1)
  }

  // Helper kenaikan Streak & Flow State
  const registerCorrectStreak = (baseMsg) => {
    const st = sim.current
    st.streak++
    if (st.streak > st.stats.maxStreak) {
      st.stats.maxStreak = st.streak
    }

    let extraMsg = ''
    if (st.streak >= 3 && st.streak % 3 === 0) {
      st.coins += 15
      st.health = Math.min(100, st.health + 4)
      extraMsg = ` · 🔥 STREAK x${st.streak} (+15🪙 & +4% Server Health!)`
    }
    if (st.streak >= 5 && st.streak % 5 === 0) {
      st.buffs.flowUntil = st.t + 10
      st.stamina = 100
      extraMsg += ` · ⚡ FLOW STATE 10s (Stamina Kebal!)`
    }

    if (baseMsg || extraMsg) {
      showFeedback(`${baseMsg}${extraMsg}`, 'good')
    }
  }

  // ---------- aksi ----------
  const decide = (ticket, action, logRead = false) => {
    const st = sim.current
    const wasTutorial = Boolean(ticket.tutorialStep)
    st.tickets = st.tickets.filter((t) => t.id !== ticket.id)
    setOpenTicket(null)

    if (action === 'approve') {
      if (ticket.buggy) {
        st.stats.badApprove++
        st.streak = 0
        recordNemesis(ticket.dev)
        const dmg = ticket.critical ? 30 : 20
        const reason =
          ticket.trap || ticket.deceptive
            ? `❌ SALAH APPROVE (${ticket.id})! Catatan ${ticket.dev} & klaim test-nya BOHONG — padahal Server Log jelas merah [ERROR]!`
            : !logRead
              ? `❌ SALAH APPROVE (${ticket.id})! Kamu belum cek Server Log — di sana ada [ERROR] merah & bukti test gagal!`
              : `❌ SALAH APPROVE (${ticket.id})! Server Log jelas merah ([ERROR]/[FATAL]). Log merah wajib REJECT!`
        showFeedback(reason, 'error')

        st.doneTickets = [
          { id: ticket.id, title: ticket.title, dev: ticket.dev, status: 'BUG LEAKED' },
          ...st.doneTickets,
        ].slice(0, 6)

        if (st.buffs.shield > 0) {
          st.buffs.shield--
          sfx.alarm()
          pushFeed(
            `🛡️ PRO SHIELD menyerap ledakan dari ${ticket.id}!`,
            '#7dd3fc',
            ticket.dev,
          )
        } else {
          sfx.error()
          damage(dmg, `${ticket.id} rusak & lolos ke prod!`, ticket.dev)
        }
      } else {
        st.stats.okApprove++
        st.done++
        st.coins += 30
        st.doneTickets = [
          { id: ticket.id, title: ticket.title, dev: ticket.dev, status: 'APPROVED' },
          ...st.doneTickets,
        ].slice(0, 6)
        sfx.approve()
        pushFeed(`🚀 ${ticket.id} rilis mulus ke production! +30🪙`, '#4ade80', ticket.dev)
        registerCorrectStreak(
          wasTutorial
            ? `✅ TEPAT! Bukti test aman & Server Log hijau [INFO] → aman di-APPROVE! (+30🪙)`
            : `✔ ${ticket.id} Approved (+30🪙)`,
        )
      }
    } else {
      if (ticket.buggy) {
        st.stats.badReject++
        st.done++
        const gain = ticket.critical ? 60 : 40
        st.coins += gain
        if (ticket.trap || ticket.deceptive) {
          st.stats.trapsCaught++
          recordNemesis(ticket.dev)
        }
        st.doneTickets = [
          { id: ticket.id, title: ticket.title, dev: ticket.dev, status: 'BUG CAUGHT' },
          ...st.doneTickets,
        ].slice(0, 6)
        sfx.cash()
        pushFeed(`🧯 Bug di ${ticket.id} tertangkap! +${gain}🪙`, '#4ade80', ticket.dev)
        if (ticket.trap || ticket.deceptive) {
          registerCorrectStreak(
            `🎯 JEBAKAN TERTANGKAP! ${ticket.dev} ngaku aman di bukti test, tapi kamu jeli melihat [ERROR] merah di Server Log! (+${gain}🪙)`,
          )
        } else {
          registerCorrectStreak(
            wasTutorial
              ? `✅ TEPAT! Ada [ERROR] merah di Server Log → berhasil kamu REJECT! (+${gain}🪙)`
              : `🧯 Bug di ${ticket.id} berhasil ditolak! (+${gain}🪙)`,
          )
        }
      } else {
        st.stats.okReject++
        st.streak = 0
        st.annoy++
        const delay = 10 + 4 * st.annoy
        const re = { ...ticket, rework: true, timerSec: null, tutorialStep: undefined }
        st.pendingRework = [...st.pendingRework, { ticket: re, at: st.t + delay }]
        sfx.reject()
        const reason = !logRead
          ? `⚠️ SALAH REJECT (${ticket.id})! Kamu belum cek Server Log — semua barisnya hijau [INFO] (aman). Tiket bersih harusnya APPROVE!`
          : `⚠️ SALAH REJECT (${ticket.id})! Server Log hijau semua [INFO] & bukti test aman, tapi kamu tolak. Dev kesal & tiket balik lagi!`
        showFeedback(reason, 'warn')
        pushFeed(
          `"Bukti test & log-nya HIJAU woi! Kok di-reject?!" (rework ${delay.toFixed(0)}s)`,
          '#facc15',
          ticket.dev,
        )
      }
    }

    if (wasTutorial && !st.tickets.some((t) => t.tutorialStep) && st.tickets.length === 0) {
      st.tickets = [makeTicket(cfg), makeTicket(cfg)]
      pushFeed(
        '🎓 Latihan selesai! Sekarang tiket sprint sesungguhnya mulai mengalir.',
        '#7dd3fc',
        'Sinta',
      )
    }

    setFrame((f) => f + 1)
  }

  const buy = (item) => {
    const st = sim.current
    if (st.coins < item.price) return
    st.coins -= item.price
    if (item.id === 'autofix') st.buffs.autofix++
    if (item.id === 'siren') {
      st.buffs.sirenUntil = st.t + item.duration
      st.stamina = 100
    }
    if (item.id === 'shield') st.buffs.shield++
    if (item.id === 'qabot') st.buffs.qabotUntil = st.t + item.duration
    pushFeed(`🛒 Membeli ${item.name}. Siap tempur!`, '#ffd23e')
    setFrame((f) => f + 1)
  }

  const useAutofix = () => {
    const st = sim.current
    if (st.buffs.autofix <= 0) return
    const crits = st.tickets.filter((t) => t.critical).sort((a, b) => a.timerSec - b.timerSec)
    const target = crits[0] || st.tickets.find((t) => t.buggy)
    if (!target) return
    st.buffs.autofix--
    st.tickets = st.tickets.filter((t) => t.id !== target.id)
    st.done++
    st.doneTickets = [
      { id: target.id, title: target.title, dev: target.dev, status: 'AUTO-FIXED' },
      ...st.doneTickets,
    ].slice(0, 6)
    sfx.approve()
    pushFeed(`🩹 AUTO-FIX menambal ${target.id} secara instan!`, '#7dd3fc', target.dev)
    if (openTicketRef.current?.id === target.id) setOpenTicket(null)
    setFrame((f) => f + 1)
  }

  // ---------- render ----------
  const gameMin = 9 * 60 + (s.t / cfg.durationSec) * 480
  const sirenOn = s.t < s.buffs.sirenUntil
  const flowOn = s.t < s.buffs.flowUntil
  const botOn = s.t < s.buffs.qabotUntil
  const screenBlur = s.stamina < 15 ? 0.8 : 0
  const hasTutorial = s.tickets.some((t) => t.tutorialStep)

  return (
    <div
      className={`relative flex h-full flex-col crt ${fx}`}
      style={{
        background: 'linear-gradient(to bottom, #16305c 0%, #0d1d3a 85%, #091224 100%)',
      }}
    >
      {/* ==================== TOP MONITOR HEADER (Sesuai 2.jfif) ==================== */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2"
        style={{
          background: 'linear-gradient(to bottom, #1b3564, #102142)',
          borderBottom: '4px solid #000',
        }}
      >
        {/* Kiri: Jam + Hari + Streak Badge */}
        <div className="flex items-center gap-2">
          <div
            className="pixel-panel flex items-center gap-2 px-3 py-1.5 font-pixel"
            style={{ fontSize: 10, background: '#1e293b', color: '#f8fafc' }}
          >
            <span>🕒</span>
            <span>{fmtClock(gameMin)}</span>
          </div>
          <div
            className="pixel-panel px-3 py-1.5 font-pixel"
            style={{ fontSize: 10, background: '#1e293b', color: '#f8fafc' }}
          >
            Day {cfg.day} · {cfg.name}
          </div>
          {s.streak >= 2 && (
            <div
              className="pixel-panel px-2.5 py-1.5 font-pixel"
              style={{
                fontSize: 9,
                background: flowOn ? '#065f46' : '#7c2d12',
                color: flowOn ? '#6ee7b7' : '#fde047',
                borderColor: '#f59e0b',
              }}
            >
              🔥 STREAK x{s.streak} {flowOn && '⚡FLOW'}
            </div>
          )}
        </div>

        {/* Tengah: Banner RELEASE DAY SURVIVAL ala 2.jfif */}
        <div
          className="pixel-panel flex flex-col items-center px-6 py-1"
          style={{
            background: 'linear-gradient(to bottom, #1d3566, #101e3d)',
            border: '3px solid #000',
          }}
        >
          <div
            className="font-pixel"
            style={{
              fontSize: 14,
              color: '#f8fafc',
              textShadow: '2px 2px 0 #000',
              letterSpacing: 2,
            }}
          >
            RELEASE DAY
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: 1 }}>
            <div style={{ width: 28, height: 2, background: '#64748b' }} />
            <span
              className="font-pixel"
              style={{ fontSize: 11, color: '#ef4444', textShadow: '2px 2px 0 #000' }}
            >
              SURVIVAL
            </span>
            <div style={{ width: 28, height: 2, background: '#64748b' }} />
          </div>
        </div>

        {/* Kanan: Segmented LED SERVER HEALTH Bar */}
        <div style={{ width: 265 }}>
          <div className="mb-1 flex items-center justify-between">
            <span
              className="font-pixel"
              style={{ fontSize: 9, color: '#f8fafc', textShadow: '1px 1px 0 #000' }}
            >
              SERVER HEALTH
            </span>
            <span
              className="font-pixel"
              style={{
                fontSize: 9,
                color: s.health > 50 ? '#4ade80' : '#ff5c52',
              }}
            >
              {Math.ceil(s.health)}%
            </span>
          </div>
          <SegmentedBar pct={s.health} total={18} mode="health" />
        </div>
      </div>

      {/* ==================== MAIN MONITOR WORKSPACE (Sesuai 2.jfif) ==================== */}
      <div
        className="flex min-h-0 flex-1 gap-3 px-3 pt-2.5 pb-1"
        style={{ filter: screenBlur ? `blur(${screenBlur}px)` : 'none' }}
      >
        {/* KIRI: WINDOW JIRA SPRINT BACKLOG 4 KOLOM */}
        <div
          className="flex min-h-0 flex-1 flex-col"
          style={{
            background: '#94a3b8',
            border: '4px solid #000',
            padding: 3,
            boxShadow: '0 6px 0 rgba(0,0,0,0.55)',
          }}
        >
          {/* Window Chrome Title Bar JIRA */}
          <div
            className="flex items-center justify-between px-2.5 py-1"
            style={{
              background: 'linear-gradient(to right, #64748b, #94a3b8)',
              borderBottom: '3px solid #000',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: 16 }}>❖</span>
              <span
                className="font-pixel"
                style={{ fontSize: 10, color: '#f8fafc', textShadow: '1px 1px 0 #000' }}
              >
                JIRA — Sprint Backlog
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-pixel" style={{ fontSize: 7, color: '#0f172a' }}>
                [Space] Buka Tiket · [C] Kopi · [S] Shop
              </span>
              <div className="flex items-center gap-1">
                {['_', '□', '✕'].map((sym, i) => (
                  <div
                    key={i}
                    className="font-pixel flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      fontSize: 8,
                      background: '#cbd5e1',
                      color: '#0f172a',
                      border: '2px solid #000',
                    }}
                  >
                    {sym}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subheader Sprint Backlog + Event / Feedback / Tutorial Banner */}
          <div
            className="flex flex-col gap-1.5 px-3 py-2"
            style={{ background: '#0f1c36', borderBottom: '3px solid #000' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 20 }}>🗂️</span>
                <span
                  className="font-pixel"
                  style={{ fontSize: 12, color: '#f8fafc', textShadow: '2px 2px 0 #000' }}
                >
                  Sprint Backlog
                </span>
              </div>
              <div className="font-pixel" style={{ fontSize: 9, color: '#93c5fd' }}>
                QA QUEUE: {s.tickets.length} · RESOLVED: {s.done} · STREAK: {s.streak}x
              </div>
            </div>

            {/* Banner Drama Kantor Dadakan (Mid-Shift Event) */}
            {officeEvent && (
              <div
                className="flex items-center justify-between gap-3 px-3 py-2"
                style={{
                  background: 'linear-gradient(to right, #311042, #1e1b4b)',
                  border: '2px solid #f472b6',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <DevAvatar name={officeEvent.dev} size={28} />
                  <div>
                    <div className="font-pixel" style={{ fontSize: 8, color: '#f472b6' }}>
                      {officeEvent.title} ({Math.ceil(officeEvent.timerSec)}s)
                    </div>
                    <div style={{ fontSize: 17, color: '#f8fafc', lineHeight: 1.15 }}>
                      {officeEvent.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                  {officeEvent.id === 'pm_bribe' && (
                    <>
                      <button
                        className="pixel-btn btn-yellow"
                        style={{ fontSize: 8, padding: '6px 8px' }}
                        onClick={() => handleOfficeEventAction('accept')}
                      >
                        🤑 TERIMA (+120🪙)
                      </button>
                      <button
                        className="pixel-btn btn-green"
                        style={{ fontSize: 8, padding: '6px 8px' }}
                        onClick={() => handleOfficeEventAction('reject')}
                      >
                        🛡️ TOLAK (+5% HP)
                      </button>
                    </>
                  )}
                  {officeEvent.id === 'snack_treat' && (
                    <button
                      className="pixel-btn btn-green"
                      style={{ fontSize: 8, padding: '6px 10px' }}
                      onClick={() => handleOfficeEventAction('claim')}
                    >
                      🍩 SIKAT! (+60 STAMINA & +40🪙)
                    </button>
                  )}
                  {officeEvent.id === 'docker_stuck' && (
                    <button
                      className="pixel-btn btn-blue blink"
                      style={{ fontSize: 8, padding: '6px 10px' }}
                      onClick={() => handleOfficeEventAction('click')}
                    >
                      🔄 RESTART DOCKER ({officeEvent.clicks}/3)
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Banner Feedback 1 Baris */}
            {feedback && (
              <div
                className="flex items-center justify-between px-3 py-1.5"
                style={{
                  background:
                    feedback.type === 'error'
                      ? '#450a0a'
                      : feedback.type === 'warn'
                        ? '#422006'
                        : '#064e3b',
                  border: `2px solid ${
                    feedback.type === 'error'
                      ? '#ef4444'
                      : feedback.type === 'warn'
                        ? '#f59e0b'
                        : '#10b981'
                  }`,
                  fontSize: 18,
                  lineHeight: 1.15,
                }}
              >
                <span
                  style={{
                    color:
                      feedback.type === 'error'
                        ? '#fecaca'
                        : feedback.type === 'warn'
                          ? '#fef08a'
                          : '#a7f3d0',
                  }}
                >
                  {feedback.text}
                </span>
                <button
                  className="font-pixel ml-2"
                  style={{
                    fontSize: 8,
                    color: '#cbd5e1',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => setFeedback(null)}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Banner Tutorial Hari 1 */}
            {hasTutorial && (
              <div
                className="flex items-center justify-between px-3 py-1.5"
                style={{
                  background: '#172554',
                  border: '2px solid #38bdf8',
                }}
              >
                <div style={{ fontSize: 17, color: '#f8fafc', lineHeight: 1.15 }}>
                  👇 <b>TUTORIAL HARI 1:</b> Klik kartu di kolom <b>QA</b> (atau tekan <b>[Space]</b>)! Ingat: <b>Log Hijau = Approve</b>, <b>Log Merah = Reject</b>.
                </div>
                <button
                  className="pixel-btn ml-3"
                  style={{ fontSize: 8, padding: '4px 8px', whiteSpace: 'nowrap' }}
                  onClick={skipTutorial}
                >
                  LEWATI ⏭
                </button>
              </div>
            )}
          </div>

          {/* 4 KOLOM KANBAN: TO DO | IN PROGRESS | QA (INTERAKTIF) | DONE */}
          <div className="flex min-h-0 flex-1" style={{ background: '#111c35' }}>
            {/* KOLOM 1: TO DO */}
            <div
              className="flex w-32 flex-col"
              style={{ borderRight: '2px solid #1e3a8a', background: '#0d172b' }}
            >
              <div
                className="py-1.5 text-center font-pixel"
                style={{
                  fontSize: 8,
                  color: '#94a3b8',
                  background: '#162442',
                  borderBottom: '2px solid #1e3a8a',
                }}
              >
                TO DO
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto p-1.5 opacity-80">
                {AMBIENT_TODOS.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#e2e8f0',
                      color: '#0f172a',
                      border: '2px solid #000',
                    }}
                  >
                    <div
                      className="px-1.5 py-0.5 font-pixel"
                      style={{
                        fontSize: 7,
                        background: item.tag === 'CRITICAL' ? '#dc2626' : '#eab308',
                        color: item.tag === 'CRITICAL' ? '#fff' : '#0f172a',
                        borderBottom: '2px solid #000',
                      }}
                    >
                      {item.id}
                    </div>
                    <div className="p-1.5">
                      <div style={{ fontSize: 15, lineHeight: 1.05, fontWeight: 'bold' }}>
                        {item.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className="font-pixel px-1"
                          style={{ fontSize: 6, background: '#cbd5e1' }}
                        >
                          {item.tag}
                        </span>
                        <DevAvatar name={item.dev} size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOLOM 2: IN PROGRESS */}
            <div
              className="flex w-36 flex-col"
              style={{ borderRight: '2px solid #1e3a8a', background: '#0f1a30' }}
            >
              <div
                className="py-1.5 text-center font-pixel"
                style={{
                  fontSize: 8,
                  color: '#cbd5e1',
                  background: '#162442',
                  borderBottom: '2px solid #1e3a8a',
                }}
              >
                IN PROGRESS
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto p-1.5">
                {s.pendingRework.map((rw) => (
                  <div
                    key={rw.ticket.id}
                    style={{
                      background: '#fef3c7',
                      color: '#0f172a',
                      border: '2px solid #000',
                    }}
                  >
                    <div
                      className="px-1.5 py-0.5 font-pixel"
                      style={{
                        fontSize: 7,
                        background: '#d97706',
                        color: '#fff',
                        borderBottom: '2px solid #000',
                      }}
                    >
                      🔁 {rw.ticket.id} ({Math.max(1, Math.ceil(rw.at - s.t))}s)
                    </div>
                    <div className="p-1.5">
                      <div style={{ fontSize: 15, lineHeight: 1.05, fontWeight: 'bold' }}>
                        {rw.ticket.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span style={{ fontSize: 13, color: '#92400e' }}>Dev ngambek...</span>
                        <DevAvatar name={rw.ticket.dev} size={16} />
                      </div>
                    </div>
                  </div>
                ))}

                {AMBIENT_INPROG.map((item) => (
                  <div
                    key={item.id}
                    className="opacity-85"
                    style={{
                      background: '#f1f5f9',
                      color: '#0f172a',
                      border: '2px solid #000',
                    }}
                  >
                    <div
                      className="px-1.5 py-0.5 font-pixel"
                      style={{
                        fontSize: 7,
                        background: '#eab308',
                        color: '#0f172a',
                        borderBottom: '2px solid #000',
                      }}
                    >
                      ⚙ {item.id}
                    </div>
                    <div className="p-1.5">
                      <div style={{ fontSize: 15, lineHeight: 1.05, fontWeight: 'bold' }}>
                        {item.title}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className="font-pixel px-1"
                          style={{ fontSize: 6, background: '#cbd5e1' }}
                        >
                          CODING...
                        </span>
                        <DevAvatar name={item.dev} size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KOLOM 3: QA (KOLOM UTAMA PEMAIN) */}
            <div
              className="flex min-h-0 flex-1 flex-col"
              style={{
                background: 'rgba(30, 58, 138, 0.35)',
                borderRight: '2px solid #1e3a8a',
              }}
            >
              <div
                className="flex items-center justify-center gap-2 py-1.5 font-pixel"
                style={{
                  fontSize: 9,
                  color: '#ffffff',
                  background: '#2563eb',
                  borderBottom: '2px solid #38bdf8',
                }}
              >
                <span>🔎 QA (KLIK / TEKAN [SPACE] UNTUK REVIEW)</span>
                <span
                  className="px-1.5 py-0.5"
                  style={{ fontSize: 8, background: '#0f172a', color: '#7dd3fc' }}
                >
                  {s.tickets.length}
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-2">
                {s.tickets.length === 0 && (
                  <div
                    className="flex flex-1 flex-col items-center justify-center text-center"
                    style={{ color: '#93c5fd', fontSize: 21 }}
                  >
                    <div>✨ Kolom QA bersih!</div>
                    <div style={{ fontSize: 17, color: '#64748b' }}>
                      Seruput kopi [C] sambil tunggu tiket berikutnya... ☕
                    </div>
                  </div>
                )}

                {s.tickets.map((t, idx) => {
                  const isNextTutorial = Boolean(t.tutorialStep) && idx === 0
                  const headerBg = t.critical
                    ? '#dc2626'
                    : t.tutorialStep
                      ? '#2563eb'
                      : '#eab308'
                  const headerTxt = t.critical || t.tutorialStep ? '#ffffff' : '#0f172a'

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        sfx.open()
                        setOpenTicket(t)
                      }}
                      className={`cursor-pointer transition-transform hover:translate-x-0.5 ${
                        t.critical ? 'critical' : ''
                      }`}
                      style={{
                        background: '#f8fafc',
                        color: '#0f172a',
                        border: isNextTutorial ? '3px solid #38bdf8' : '3px solid #000',
                        boxShadow: isNextTutorial
                          ? '0 0 12px rgba(56, 189, 248, 0.85), 0 4px 0 #000'
                          : '0 4px 0 rgba(0,0,0,0.65)',
                      }}
                    >
                      {/* Header Kartu Jira */}
                      <div
                        className="flex items-center justify-between px-2.5 py-1"
                        style={{
                          background: headerBg,
                          color: headerTxt,
                          borderBottom: '2px solid #000',
                        }}
                      >
                        <div className="flex items-center gap-1.5 font-pixel" style={{ fontSize: 9 }}>
                          <span>{t.critical ? '🐞' : t.tutorialStep ? '🎓' : '🔧'}</span>
                          <span>
                            {t.id}: {t.title}
                          </span>
                        </div>
                        <div className="font-pixel" style={{ fontSize: 8 }}>
                          {t.critical
                            ? `⏰ ${Math.max(0, Math.ceil(t.timerSec))}s`
                            : isNextTutorial
                              ? '👈 KLIK / [SPACE]'
                              : t.rework
                                ? '🔁 REWORK'
                                : t.category.toUpperCase()}
                        </div>
                      </div>

                      {/* Isi Putih Kartu Jira */}
                      <div className="p-2">
                        <div
                          style={{
                            fontSize: 17,
                            color: '#334155',
                            lineHeight: 1.15,
                          }}
                        >
                          💬 <b>{t.dev}:</b> <i>"{t.note}"</i>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="font-pixel px-1.5 py-0.5"
                              style={{
                                fontSize: 7,
                                background: t.critical ? '#dc2626' : '#d97706',
                                color: '#ffffff',
                                border: '1px solid #000',
                              }}
                            >
                              {t.critical ? 'CRITICAL' : 'MEDIUM'}
                            </span>
                            <span style={{ fontSize: 15, color: '#64748b' }}>
                              📁 {t.module}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span style={{ fontSize: 15, color: '#475569' }}>{t.dev}</span>
                            <DevAvatar name={t.dev} size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* KOLOM 4: DONE */}
            <div className="flex w-36 flex-col" style={{ background: '#0d172b' }}>
              <div
                className="py-1.5 text-center font-pixel"
                style={{
                  fontSize: 8,
                  color: '#4ade80',
                  background: '#162442',
                  borderBottom: '2px solid #1e3a8a',
                }}
              >
                DONE ({s.done})
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto p-1.5">
                {s.doneTickets.map((dt, i) => {
                  const isLeak = dt.status === 'BUG LEAKED'
                  return (
                    <div
                      key={`${dt.id}-${i}`}
                      style={{
                        background: isLeak ? '#fecaca' : '#dcfce7',
                        color: '#0f172a',
                        border: '2px solid #000',
                      }}
                    >
                      <div
                        className="px-1.5 py-0.5 font-pixel"
                        style={{
                          fontSize: 7,
                          background: isLeak ? '#dc2626' : '#16a34a',
                          color: '#ffffff',
                          borderBottom: '2px solid #000',
                        }}
                      >
                        {dt.id} · {dt.status}
                      </div>
                      <div className="p-1.5">
                        <div style={{ fontSize: 14, lineHeight: 1.05, fontWeight: 'bold' }}>
                          {dt.title}
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span style={{ fontSize: 13, color: '#334155' }}>{dt.dev}</span>
                          <DevAvatar name={dt.dev} size={15} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== SIDEBAR KANAN (Sesuai 2.jfif) ==================== */}
        <div className="flex w-72 flex-col gap-2">
          {/* 1. Banner Incident Merah */}
          <div
            className={`pixel-panel flex items-center justify-center gap-2 py-1.5 font-pixel ${
              criticals > 0 ? 'blink' : ''
            }`}
            style={{
              fontSize: 11,
              background: criticals > 0 ? '#b91c1c' : '#1e293b',
              color: criticals > 0 ? '#fef08a' : '#94a3b8',
              border: '3px solid #000',
            }}
          >
            <span>⚠</span>
            <span>{criticals > 0 ? `INCIDENT (${criticals} CRITICAL!)` : 'NO ACTIVE INCIDENT'}</span>
          </div>

          {/* 2. Panel QA Lead + Segmented Stamina Bar + Webcam */}
          <div
            className="pixel-panel flex items-center gap-2.5 p-2.5"
            style={{ background: '#162442' }}
          >
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: 72,
                height: 82,
                background: '#080e1c',
                border: '3px solid #000',
                flexShrink: 0,
              }}
            >
              <Character
                look={look}
                size={68}
                glow={flowOn}
                style={{ filter: s.stamina < 25 ? 'saturate(0.45)' : 'none' }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span style={{ fontSize: 16 }}>❤️</span>
                  <span className="font-pixel truncate" style={{ fontSize: 10, color: '#f8fafc' }}>
                    {name}
                  </span>
                </div>
                {flowOn && (
                  <span className="font-pixel" style={{ fontSize: 7, color: '#4ade80' }}>
                    ⚡FLOW
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-pixel" style={{ fontSize: 7, color: '#93c5fd' }}>
                  ⏳ STAMINA {(sirenOn || flowOn) && '⚡'}
                </span>
                <span className="font-pixel" style={{ fontSize: 7, color: '#cbd5e1' }}>
                  {Math.round(s.stamina)}%
                </span>
              </div>
              <div className="mt-1">
                <SegmentedBar pct={s.stamina} total={10} mode="stamina" />
              </div>
            </div>
          </div>

          {/* 3. Stats + Radar + Tombol QA Shop + Dev Team Status */}
          <div
            className="pixel-panel flex flex-col gap-2 p-2.5"
            style={{ background: '#111c35' }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-pixel" style={{ fontSize: 10, color: '#ffd23e' }}>
                    🪙 {s.coins.toLocaleString('id-ID')}
                  </span>
                  <button
                    className="pixel-btn btn-yellow"
                    style={{ fontSize: 8, padding: '5px 8px' }}
                    onClick={() => {
                      sfx.click()
                      setShopOpen(true)
                    }}
                    title="Buka QA Shop [S]"
                  >
                    🛒 SHOP [S]
                  </button>
                </div>

                {/* Tombol Buff / Inventory */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    className="pixel-btn"
                    style={{ fontSize: 8, padding: '4px 7px' }}
                    disabled={s.buffs.autofix <= 0 || !s.tickets.some((t) => t.buggy)}
                    onClick={useAutofix}
                    title="Gunakan Auto-Fix pada bug paling darurat"
                  >
                    🩹 x{s.buffs.autofix}
                  </button>
                  <div
                    className="pixel-panel px-2 py-0.5 font-pixel"
                    style={{ fontSize: 8, background: '#091020' }}
                  >
                    🛡️ x{s.buffs.shield}
                  </div>
                  {sirenOn && (
                    <div
                      className="pixel-panel blink px-1.5 py-0.5 font-pixel"
                      style={{ fontSize: 8, color: '#4ade80' }}
                    >
                      🥤{Math.ceil(s.buffs.sirenUntil - s.t)}s
                    </div>
                  )}
                  {botOn && (
                    <div
                      className="pixel-panel blink px-1.5 py-0.5 font-pixel"
                      style={{ fontSize: 8, color: '#38bdf8' }}
                    >
                      🤖{Math.ceil(s.buffs.qabotUntil - s.t)}s
                    </div>
                  )}
                </div>
              </div>

              {/* Kanan: Mini Server Radar Grid */}
              <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{
                  width: 58,
                  height: 54,
                  background: '#062016',
                  border: '2px solid #000',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'linear-gradient(to right, rgba(34,197,94,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,197,94,0.2) 1px, transparent 1px)',
                    backgroundSize: '10px 10px',
                  }}
                />
                <span
                  className={criticals > 0 ? 'blink' : ''}
                  style={{
                    fontSize: 16,
                    color: criticals > 0 ? '#ef4444' : '#22c55e',
                  }}
                >
                  {criticals > 0 ? '🔺' : '🟢'}
                </span>
              </div>
            </div>

            {/* Banner DEV TEAM */}
            <div
              className="py-1 text-center font-pixel"
              style={{
                background: '#090d16',
                border: '2px solid #000',
                fontSize: 8,
                color: s.annoy > 2 ? '#ef4444' : s.annoy > 0 ? '#facc15' : '#4ade80',
              }}
            >
              DEV TEAM: {s.annoy > 2 ? 'OVERLOADED 😡' : s.annoy > 0 ? 'ANNOYED 😒' : 'NORMAL 🙂'}
            </div>
          </div>

          {/* 4. COMMS Chat Window */}
          <div
            className="pixel-panel flex min-h-0 flex-1 flex-col p-2.5"
            style={{ background: '#111c35' }}
          >
            <div
              className="mb-1.5 flex items-center justify-between pb-1"
              style={{ borderBottom: '2px solid #1e3a8a' }}
            >
              <span className="font-pixel" style={{ fontSize: 9, color: '#f8fafc' }}>
                💬 COMMS
              </span>
              <span className="font-pixel" style={{ fontSize: 7, color: '#64748b' }}>
                #qa-release
              </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {s.feed.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-2 p-1.5"
                  style={{
                    background: '#0a1224',
                    border: '1px solid #1e293b',
                  }}
                >
                  {f.dev ? (
                    <DevAvatar name={f.dev} size={22} />
                  ) : (
                    <span style={{ fontSize: 16 }}>📢</span>
                  )}
                  <div style={{ fontSize: 16, lineHeight: 1.1 }}>
                    {f.dev && (
                      <div
                        className="font-pixel"
                        style={{ fontSize: 7, color: '#ffd23e', marginBottom: 2 }}
                      >
                        {f.dev}
                      </div>
                    )}
                    <div style={{ color: f.color }}>{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== PHYSICAL WOODEN DESK STRIP (Sesuai 2.jfif) ==================== */}
      <div
        className="relative flex items-center justify-between px-6 py-2"
        style={{
          height: 76,
          background: 'linear-gradient(to bottom, #3d2817 0%, #26170c 100%)',
          borderTop: '5px solid #000',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="px-4 py-2 font-pixel"
            style={{
              background: '#4a2e16',
              color: '#f8fafc',
              border: '3px solid #000',
              boxShadow: '0 4px 0 #140c06, inset 0 2px 0 #7c512b',
              fontSize: 11,
              transform: 'rotate(-3deg)',
            }}
          >
            QA LEAD
          </div>

          <DeskCookie />

          <div
            className="px-2.5 py-1 text-center"
            style={{
              background: '#facc15',
              color: '#1c1917',
              border: '2px solid #000',
              fontSize: 15,
              lineHeight: 1.05,
              fontWeight: 'bold',
              transform: 'rotate(-2deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
            }}
          >
            LOG MERAH
            <br />= REJECT!
          </div>
          <div
            className="px-2.5 py-1 text-center"
            style={{
              background: '#a3e635',
              color: '#14532d',
              border: '2px solid #000',
              fontSize: 15,
              lineHeight: 1.05,
              fontWeight: 'bold',
              transform: 'rotate(2deg)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
            }}
          >
            LOG HIJAU
            <br />= APPROVE!
          </div>
        </div>

        <div className="hidden md:flex">
          <DeskKeyboardAndMouse />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right" style={{ fontSize: 17, color: '#fde68a', lineHeight: 1.1 }}>
            {s.coffeeCd > 0 ? (
              <span>⏳ Kopi diseduh ({Math.ceil(s.coffeeCd)}s)...</span>
            ) : (
              <span>
                <b>Klik Kopi [C] ☕</b>
                <br />
                <span style={{ fontSize: 15, color: '#d6bc94' }}>+40 Stamina Fokus</span>
              </span>
            )}
          </div>
          <button
            onClick={drinkCoffee}
            disabled={s.coffeeCd > 0}
            className="relative"
            style={{
              background: 'none',
              border: 'none',
              cursor: s.coffeeCd > 0 ? 'wait' : 'pointer',
              opacity: s.coffeeCd > 0 ? 0.45 : 1,
              padding: 0,
            }}
            title="Minum kopi [C] (+40 stamina)"
          >
            <img
              src="/assets/character/04_coffee_cup.png"
              alt="kopi"
              width={56}
              height={56}
              draggable={false}
            />
          </button>
        </div>
      </div>

      {/* ==================== OVERLAYS ==================== */}
      {openTicket && !s.tickets.every((t) => t.id !== openTicket.id) && (
        <TicketModal
          ticket={openTicket}
          stamina={s.stamina}
          onDecide={decide}
          onClose={() => {
            sfx.click()
            setOpenTicket(null)
          }}
          onReadLog={() => {
            const st = sim.current
            if (
              !openTicket.tutorialStep &&
              !(st.t < st.buffs.sirenUntil) &&
              !(st.t < st.buffs.flowUntil)
            ) {
              st.stamina = Math.max(0, st.stamina - 6)
            }
          }}
        />
      )}
      {shopOpen && (
        <Shop
          coins={s.coins}
          day={cfg.day}
          look={look}
          setLook={setLook}
          unlocked={unlocked}
          onBuy={buy}
          onBuyCosmetic={(item) => {
            const st = sim.current
            if (st.coins < item.price) return
            st.coins -= item.price
            onUnlockItem?.(item.id)
            pushFeed(`👕 Membeli & memakai ${item.name}!`, '#7dd3fc')
            setFrame((f) => f + 1)
          }}
          onTopup={(amount) => {
            sim.current.coins += amount
            pushFeed(
              `💳 Top-up ${amount}🪙 sukses (SIMULASI). Dompet aman!`,
              '#ffd23e',
            )
            setFrame((f) => f + 1)
          }}
          onClose={() => {
            sfx.click()
            setShopOpen(false)
          }}
        />
      )}
    </div>
  )
}
