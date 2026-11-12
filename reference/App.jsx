import { useState } from 'react';
import './App.css';

function App() {
  const [serverHealth, setServerHealth] = useState(100);
  const [hairType, setHairType] = useState('02_hair_messy');

  return (
    <div className="game-container">
      <header className="header">
        <h1>Release Day Survival</h1>
        <div className="health-bar">Server Health: {serverHealth}%</div>
      </header>
      
      <main className="desk-area">
        <div className="kanban-board">
            <h2>Tickets</h2>
            <div className="ticket">
                <img src="/src/assets/ui/ticket_critical.png" width="200" alt="Ticket" />
                <div className="actions">
                    <button onClick={() => setServerHealth(h => h - 20)}>Approve</button>
                    <button>Reject</button>
                </div>
            </div>
        </div>
        
        <div className="character-preview">
          <img src="/src/assets/character/01_base_body.png" className="layer" alt="Base" />
          <img src={`/src/assets/character/${hairType}.png`} className="layer" alt="Hair" />
          <img src="/src/assets/character/03_glasses.png" className="layer" alt="Glasses" />
          <img src="/src/assets/character/04_coffee_cup.png" className="layer" alt="Coffee" />
        </div>
        
        <div className="customizer">
            <button onClick={() => setHairType('02_hair_messy')}>Messy Hair</button>
            <button onClick={() => setHairType('02_hair_neat')}>Neat Hair</button>
        </div>
      </main>
    </div>
  );
}

export default App;
