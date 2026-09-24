import { useEffect, useState } from 'react';
import floralDivider from '../../assets/Images/floral-divider.webp';
import './Countdown.css';

const WEDDING_DATE = new Date('2026-10-14T00:00:00+05:30').getTime();

function getTimeLeft() {
  const remaining = Math.max(0, WEDDING_DATE - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    ['days', 'Days'],
    ['hours', 'Hours'],
    ['minutes', 'Minutes'],
    ['seconds', 'Seconds'],
  ];

  return (
    <section className="countdown-section" aria-labelledby="countdown-title">
      <div className="countdown-panel">
        <img className="countdown-divider countdown-divider-top" src={floralDivider} alt="" aria-hidden="true" />
        <div className="countdown-heading">
          <p className="countdown-kicker">UNTIL WE SAY QUBOOL HAI</p>
          <h2 id="countdown-title">Counting every heartbeat</h2>
          <span className="countdown-flourish" aria-hidden="true">◇</span>
        </div>
        <div className="countdown" aria-label="Countdown to October 14, 2026">
          {units.map(([unit, label]) => (
            <div
              className="countdown-unit"
              key={unit}
            >
              <span className="countdown-value" aria-live={unit === 'seconds' ? 'off' : undefined}>
                {String(timeLeft[unit]).padStart(2, '0')}
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
        <img className="countdown-divider countdown-divider-bottom" src={floralDivider} alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

export default Countdown;
