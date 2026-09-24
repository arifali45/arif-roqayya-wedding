import { motion } from 'framer-motion';
import couplePhoto from '../../assets/Images/CouplePhoto.png';
import './Hero.css';

function Hero() {
  return (
    <main className="hero" aria-labelledby="invitation-title">
      <div className="hero-floral hero-floral-left" aria-hidden="true">
        <img src={couplePhoto} alt="" />
      </div>
      <div className="hero-floral hero-floral-right" aria-hidden="true">
        <img src={couplePhoto} alt="" />
      </div>
      <div className="hero-frame hero-frame-outer" aria-hidden="true" />
      <div className="hero-frame hero-frame-inner" aria-hidden="true" />

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <motion.p
          className="hero-bismillah"
          lang="ar"
          dir="rtl"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.p>

        <div className="hero-divider" aria-hidden="true"><span>✦</span></div>

        <motion.p
          className="hero-intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          With gratitude to Allah, we invite you to the Nikah of
        </motion.p>

        <div className="hero-couple">
          <motion.div
            className="hero-person"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
          >
            <span className="hero-role">THE BRIDE</span>
            <h1 id="invitation-title">Roqayya<br />Fatima</h1>
            <span className="hero-family">Daughter of Late Mr Shaik Shamim Ahmed & Mrs Sagira Parween</span>
          </motion.div>

          <span className="hero-ampersand" aria-hidden="true">&amp;</span>

          <motion.div
            className="hero-person"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <span className="hero-role">THE GROOM</span>
            <p className="hero-name">Arif Ali</p>
            <span className="hero-family">Son of Mr Anwar Ali & Mrs Najma Khatoon</span>
          </motion.div>
        </div>

        <motion.p
          className="hero-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          A new chapter begins in faith, joy and love.
        </motion.p>
      </motion.div>

      <a className="hero-scroll" href="#welcome-title" aria-label="Scroll to the wedding welcome">
        <span>Scroll to discover</span>
        <span className="hero-scroll-line" aria-hidden="true" />
      </a>
    </main>
  );
}

export default Hero;
