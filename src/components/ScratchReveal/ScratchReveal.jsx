import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import scratchFrame from '../../assets/Images/scratch-frame.webp';
import floralDivider from '../../assets/Images/floral-divider.webp';
import './ScratchReveal.css';

function ScratchReveal() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const [revealed, setRevealed] = useState(false);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    const card = containerRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !card || !ctx) return;

    const { width, height } = card.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cover = ctx.createLinearGradient(0, 0, width, height);
    cover.addColorStop(0, '#d3b873');
    cover.addColorStop(0.5, '#a47a39');
    cover.addColorStop(1, '#d0b16c');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = cover;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 248, 222, 0.16)';
    for (let x = 12; x < width; x += 22) {
      for (let y = 12; y < height; y += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    paintCover();
    const card = containerRef.current;
    if (!card || !window.ResizeObserver) return undefined;
    const observer = new ResizeObserver(paintCover);
    observer.observe(card);
    return () => observer.disconnect();
  }, [paintCover]);

  const scratch = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const stride = 4 * 12;
    let checked = 0;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += stride) {
      checked += 1;
      if (pixels[i] < 32) transparent += 1;
    }
    if (checked > 0 && transparent / checked > 0.42) setRevealed(true);
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    isDrawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event);
  };

  const handlePointerMove = (event) => {
    if (isDrawing.current) scratch(event);
  };

  const handlePointerEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    checkReveal();
  };

  return (
    <section className="scratch-section" aria-labelledby="scratch-title">
      <img className="scratch-floral-divider" src={floralDivider} alt="" aria-hidden="true" />
      <motion.div
        className="scratch-header"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="scratch-kicker">A DATE TO HOLD CLOSE</p>
        <h2 id="scratch-title">Our forever begins</h2>
        <div className="scratch-divider" aria-hidden="true">◇</div>
      </motion.div>

      <motion.div
        className={`scratch-stage${revealed ? ' revealed' : ''}`}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img className="scratch-frame" src={scratchFrame} alt="" aria-hidden="true" />
        <div className="scratch-surface" ref={containerRef}>
          <div className="scratch-content" aria-live="polite">
            <span>YOU’RE INVITED</span>
            <strong>14</strong>
            <div className="scratch-month">OCTOBER 2026</div>
            <div className="scratch-time">Wednesday 8.00 PM</div>
          </div>

          {!revealed && (
            <canvas
              ref={canvasRef}
              className="scratch-canvas"
              aria-label="Scratch the gold surface to reveal the wedding date"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onLostPointerCapture={handlePointerEnd}
            />
          )}
        </div>
      </motion.div>

      {!revealed && (
        <>
          <motion.p
            className="scratch-hint"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✋ Scratch gently to reveal the date
          </motion.p>
          <button className="scratch-reveal-button" type="button" onClick={() => setRevealed(true)}>
            Reveal date
          </button>
        </>
      )}
    </section>
  );
}

export default ScratchReveal;
