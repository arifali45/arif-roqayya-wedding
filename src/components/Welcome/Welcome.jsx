import { motion } from 'framer-motion';
import floralDivider from '../../assets/Images/floral-divider.webp';
import './Welcome.css';

function Welcome() {
  return (
    <section className="welcome-section" aria-labelledby="welcome-title">
      <img className="welcome-floral-divider" src={floralDivider} alt="" aria-hidden="true" />

      <motion.div
        className="welcome-content"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9 }}
      >
        <p className="welcome-initial" aria-hidden="true">A</p>
        <p className="welcome-kicker">WITH FULL HEARTS</p>
        <h2 id="welcome-title">A blessing<br />a beginning</h2>
        <p className="welcome-message">
          With hearts full of gratitude, we warmly invite you to join us as
          Roqayya and Arif begin their life together, surrounded by the love,
          prayers, and blessings of their families.
        </p>
        <div className="welcome-names" aria-label="Roqayya and Arif">
          <span>Roqayya</span>
          <span className="welcome-ampersand" aria-hidden="true">&amp;</span>
          <span>Arif</span>
        </div>
      </motion.div>

      <a className="welcome-scroll" href="#scratch-title">
        A date to hold close
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

export default Welcome;
