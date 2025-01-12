'use client';

import { useState, useEffect } from 'react';
import styles from './SlotMachine.module.css';

const SYMBOLS = ['🍒', '🍋', '📊'];
const SPIN_DURATION = 2000;

export default function SlotMachine() {
  const [reels, setReels] = useState<string[][]>([
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]],
    [SYMBOLS[0], SYMBOLS[1], SYMBOLS[2]]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [score, setScore] = useState(1000);
  const [message, setMessage] = useState('');
  const [audio] = useState(typeof Audio !== 'undefined' ? new Audio('/spin.mp3') : null);

  const checkWin = (newReels: string[][]) => {
    let won = false;
    
    // Yatay kontrol
    for (let i = 0; i < 3; i++) {
      if (newReels[i][0] === newReels[i][1] && newReels[i][1] === newReels[i][2]) {
        won = true;
        break;
      }
    }

    // Dikey kontrol
    for (let i = 0; i < 3; i++) {
      if (newReels[0][i] === newReels[1][i] && newReels[1][i] === newReels[2][i]) {
        won = true;
        break;
      }
    }

    // Çapraz kontrol
    if (newReels[0][0] === newReels[1][1] && newReels[1][1] === newReels[2][2]) won = true;
    if (newReels[0][2] === newReels[1][1] && newReels[1][1] === newReels[2][0]) won = true;

    return won;
  };

  const spin = () => {
    if (isSpinning || score < 10) return;
    
    setIsSpinning(true);
    setMessage('');
    setScore(prev => prev - 10);
    audio?.play();

    setTimeout(() => {
      const newReels = reels.map(() =>
        Array(3).fill(0).map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      );

      setReels(newReels);
      const won = checkWin(newReels);

      if (won) {
        setScore(prev => prev + 50);
        setMessage('Kazandınız! +50 puan 🎉');
      } else {
        setMessage('Tekrar deneyin!');
      }

      setIsSpinning(false);
    }, SPIN_DURATION);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Slot Oyunu</h1>
      <div className={styles.score}>Puan: {score}</div>
      
      <div className={`${styles.slotMachine} ${isSpinning ? styles.spinning : ''}`}>
        {reels.map((reel, i) => (
          <div key={i} className={styles.reel}>
            {reel.map((symbol, j) => (
              <div key={j} className={styles.symbol}>
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button 
        className={styles.spinButton} 
        onClick={spin} 
        disabled={isSpinning || score < 10}
      >
        {isSpinning ? 'Dönüyor...' : 'Çevir (10 puan)'}
      </button>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
} 