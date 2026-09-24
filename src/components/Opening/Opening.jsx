import { motion } from 'framer-motion';
import './Opening.css';

function Opening({ onOpen }) {
  return (
    <motion.section
      className="opening"
      aria-label="Wedding invitation cover"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <motion.div
        className="opening-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.div
          className="bismillah"
          lang="ar"
          dir="rtl"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </motion.div>

        <motion.p
          className="small-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          With the blessings of Allah
        </motion.p>

        <motion.div
          className="ornament"
          aria-hidden="true"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.75, duration: 0.7 }}
        >
          ✦
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
        >
          Roqayya Fatima
        </motion.h1>

        <motion.div
          className="weds"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05 }}
        >
          WEDS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.9 }}
        >
          Arif Ali
        </motion.h1>

        <motion.div
          className="ornament"
          aria-hidden="true"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.35, duration: 0.7 }}
        >
          ✦
        </motion.div>

        <motion.p
          className="date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          14 · 10 · 2026
        </motion.p>

        <motion.button
          className="open-button"
          type="button"
          onClick={onOpen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          OPEN INVITATION
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default Opening;
