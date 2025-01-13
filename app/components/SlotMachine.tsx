'use client';

import { useState, useEffect } from 'react';
import styles from './SlotMachine.module.css';
import React from 'react';

const SYMBOLS = ['🍒', '🍋', '📊'];
const REEL_SYMBOLS_COUNT = 10;
const SPIN_DURATION = 2000;
const STOP_DURATION = 800;

export default function SlotMachine() {
  // Başlangıç sembollerini sabit bir düzende oluştur
  const initialReels = [
    Array(REEL_SYMBOLS_COUNT).fill(SYMBOLS[0]),
    Array(REEL_SYMBOLS_COUNT).fill(SYMBOLS[1]),
    Array(REEL_SYMBOLS_COUNT).fill(SYMBOLS[2])
  ];

  const [reels, setReels] = useState<string[][]>(initialReels);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);
  const [centerIndexes, setCenterIndexes] = useState([4, 4, 4]);
  const [isClient, setIsClient] = useState(false);

  // Client tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rastgele sembol oluşturma fonksiyonu
  const generateReelSymbols = () => {
    return Array(REEL_SYMBOLS_COUNT).fill(null).map(() => 
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    );
  };

  const checkWin = () => {
    if (!isClient) return false;
    const centerSymbols = reels.map((reel, i) => reel[centerIndexes[i]]);
    
    // Tüm semboller aynı mı?
    return centerSymbols[0] === centerSymbols[1] && centerSymbols[1] === centerSymbols[2];
  };

  const spin = () => {
    if (isSpinning || score < 10) return;
    
    setIsSpinning(true);
    setIsStopping(false);
    setMessage('');
    setWon(false);
    setScore(prev => prev - 10);

    // Her makara için yeni semboller oluştur
    const newReels = [
      generateReelSymbols(),
      generateReelSymbols(),
      generateReelSymbols()
    ];

    // Makaraları döndür
    setTimeout(() => {
      setIsStopping(true);
      setIsSpinning(false);
      setReels(newReels);

      // Rastgele merkez pozisyonları belirle
      const newCenterIndexes = centerIndexes.map(() => 
        Math.floor(Math.random() * REEL_SYMBOLS_COUNT)
      );
      setCenterIndexes(newCenterIndexes);

      // Durma süresi ve sonuç kontrolü
      setTimeout(() => {
        const hasWon = checkWin();
        setWon(hasWon);
        setIsStopping(false);

        // Sembolleri görünür yap
        setReels(prevReels => prevReels.map(reel => reel.map(symbol => symbol)));

        if (hasWon) {
          setScore(prev => prev + 50);
          setMessage('Kazandınız! +50 puan 🎉');
        } else {
          setMessage('Tekrar deneyin!');
        }
      }, STOP_DURATION);
    }, SPIN_DURATION);
  };

  const addPoints = (points: number) => {
    setScore(prev => prev + points);
  };

  // Client tarafında olana kadar render etme
  if (!isClient) {
    return <div className={styles.container}>Yükleniyor...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Slot Oyunu</h1>
      <div className={styles.score}>Puan: {score}</div>
      
      <div className={styles.pointAdder}>
        <button onClick={() => addPoints(100)} className={styles.addButton}>+100 Puan</button>
        <button onClick={() => addPoints(1000)} className={styles.addButton}>+1000 Puan</button>
      </div>

      <div className={`${styles.slotMachine} ${isSpinning ? styles.spinning : ''} ${isStopping ? styles.stopping : ''}`}>
        {reels.map((reel, i) => (
          <div key={i} className={styles.reel}>
            <div className={styles.reelWindow}>
              <div className={styles.centerLine} />
              <div className={styles.symbolsContainer}>
                {reel.map((symbol, j) => (
                  <div 
                    key={j} 
                    className={`${styles.symbol} ${j === centerIndexes[i] ? styles.center : ''}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={styles.spinButton} 
        onClick={spin} 
        disabled={isSpinning || isStopping || score < 10}
      >
        {isSpinning ? 'Dönüyor...' : 'Çevir (10 puan)'}
      </button>

      {message && (
        <div className={`${styles.message} ${won ? styles.win : ''}`}>
          {message}
        </div>
      )}
    </div>
  );
} 