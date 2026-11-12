import { useEffect, useState } from 'react'
import { DAYS } from './game/data.js'
import { DEFAULT_LOOK, DEFAULT_UNLOCKED, normalizeLook } from './game/cosmetics.js'
import { setMuted, isMuted, sfx } from './game/audio.js'
import TitleScreen from './components/TitleScreen.jsx'
import Customizer from './components/Customizer.jsx'
import DayIntro from './components/DayIntro.jsx'
import GameScreen from './components/GameScreen.jsx'
import { DaySummary, EndingScreen } from './components/EndScreen.jsx'

function loadSavedLook() {
  try {
    return JSON.parse(localStorage.getItem('qa-sim-look') || 'null')
  } catch {
    return null
  }
}

function loadSavedUnlocks() {
  try {
    const raw = JSON.parse(localStorage.getItem('qa-sim-unlocks') || 'null')
    if (Array.isArray(raw)) {
      return Array.from(new Set([...DEFAULT_UNLOCKED, ...raw]))
    }
    return DEFAULT_UNLOCKED
  } catch {
    return DEFAULT_UNLOCKED
  }
}

export default function App() {
  const [screen, setScreen] = useState('title') // title | customize | intro | play | summary | ending
  const [look, setLook] = useState(() => normalizeLook(loadSavedLook() || DEFAULT_LOOK))
  const [name, setName] = useState(() => loadSavedLook()?.name || 'QA Lead')
  const [unlocked, setUnlocked] = useState(() => loadSavedUnlocks())
  const [dayIdx, setDayIdx] = useState(0)
  const [health, setHealth] = useState(100)
  const [coins, setCoins] = useState(400)
  const [lastResult, setLastResult] = useState(null)
  const [ending, setEnding] = useState(null)
  const [muted, setMutedState] = useState(isMuted())
  const [playKey, setPlayKey] = useState(0)

  const cfg = DAYS[dayIdx]

  useEffect(() => {
    try {
      localStorage.setItem('qa-sim-look', JSON.stringify({ ...look, name }))
    } catch {
      /* private mode dsb. */
    }
  }, [look, name])

  useEffect(() => {
    try {
      localStorage.setItem('qa-sim-unlocks', JSON.stringify(unlocked))
    } catch {
      /* private mode dsb. */
    }
  }, [unlocked])

  const unlockItem = (itemId) => {
    setUnlocked((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]))
  }

  const buyCosmeticInCustomizer = (item) => {
    if (coins < item.price) return
    setCoins((c) => c - item.price)
    unlockItem(item.id)
  }

  const startRun = () => {
    setDayIdx(0)
    setHealth(100)
    setCoins((c) => Math.max(400, c))
    setEnding(null)
    setScreen('customize')
  }

  const onDayFinish = (result) => {
    setLastResult(result)
    setCoins(result.coins)
    setHealth(result.health)

    if (result.result === 'fired') {
      setEnding('fired')
      setScreen('ending')
      return
    }
    // selamat sampai 17:00
    if (cfg.day === 5) {
      if (result.queueLen === 0 && result.health > 50) setEnding('good')
      else setEnding('overtime')
      setScreen('ending')
    } else {
      setScreen('summary')
    }
  }

  const nextDay = () => {
    setHealth((h) => Math.min(100, h + 25)) // ops menambal semalam
    setDayIdx((d) => d + 1)
    setScreen('intro')
  }

  return (
    <div className="relative h-full">
      {/* credit global di pojok kiri bawah */}
      <a
        href="https://yumastudio.digital/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-pixel absolute z-[70]"
        style={{
          fontSize: 8,
          left: 10,
          bottom: 6,
          padding: '4px 8px',
          background: 'rgba(8, 12, 22, 0.78)',
          color: '#7dd3fc',
          border: '1px solid #1e3a8a',
          textDecoration: 'none',
          opacity: 0.88,
        }}
      >
        Build by yumastudio.digital
      </a>

      {/* tombol mute global */}
      <button
        className="pixel-btn absolute z-[70]"
        style={{ fontSize: 9, right: 10, bottom: 10, padding: '6px 8px', opacity: 0.8 }}
        onClick={() => {
          const m = !muted
          setMuted(m)
          setMutedState(m)
          if (!m) sfx.click()
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {screen === 'title' && <TitleScreen onStart={startRun} />}

      {screen === 'customize' && (
        <Customizer
          look={look}
          setLook={setLook}
          name={name}
          coins={coins}
          unlocked={unlocked}
          onBuyCosmetic={buyCosmeticInCustomizer}
          onConfirm={(nm) => {
            setName(nm)
            setScreen('intro')
          }}
        />
      )}

      {screen === 'intro' && (
        <DayIntro
          cfg={cfg}
          look={look}
          name={name}
          health={health}
          coins={coins}
          onStart={() => {
            setPlayKey((k) => k + 1)
            setScreen('play')
          }}
        />
      )}

      {screen === 'play' && (
        <GameScreen
          key={playKey}
          cfg={cfg}
          look={look}
          setLook={setLook}
          unlocked={unlocked}
          onUnlockItem={unlockItem}
          name={name}
          startHealth={health}
          startCoins={coins}
          onFinish={onDayFinish}
        />
      )}

      {screen === 'summary' && lastResult && <DaySummary cfg={cfg} result={lastResult} onNext={nextDay} />}

      {screen === 'ending' && ending && (
        <EndingScreen endingId={ending} look={look} name={name} result={lastResult} onRestart={() => setScreen('title')} />
      )}
    </div>
  )
}
