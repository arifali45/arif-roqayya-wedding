import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import couplePhoto from '../../assets/Images/CouplePhoto.png';
import couplePhoto2 from '../../assets/Images/couplePhoto2.png';
import couplePhoto3 from '../../assets/Images/couplePhoto3.png';
import './OurStory.css';

const photos = [
  {
    src: couplePhoto,
    alt: 'Roqayya and Arif beneath a flower-covered wedding arch',
  },
  {
    src: couplePhoto2,
    alt: 'Roqayya and Arif sharing a quiet moment together',
  },
  {
    src: couplePhoto3,
    alt: 'Roqayya and Arif holding hands in their wedding attire',
  },
];

function OurStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  const showPhoto = (index) => {
    setActiveIndex((index + photos.length) % photos.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % photos.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="story-section" aria-labelledby="story-title">
      <motion.header
        className="story-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="story-kicker">OUR STORY</p>
        <h2 id="story-title">Moments, softly held</h2>
        <div className="story-divider" aria-hidden="true"><span>◇</span></div>
      </motion.header>

      <div className="story-carousel" role="region" aria-roledescription="carousel" aria-label="Roqayya and Arif’s photo gallery">
        <div className="story-photo-frame">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              className="story-photo"
              src={photos[activeIndex].src}
              alt={photos[activeIndex].alt}
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          </AnimatePresence>
          <button
            className="story-arrow story-arrow-prev"
            type="button"
            aria-label="Show previous photo"
            onClick={() => showPhoto(activeIndex - 1)}
          >
            ‹
          </button>
          <button
            className="story-arrow story-arrow-next"
            type="button"
            aria-label="Show next photo"
            onClick={() => showPhoto(activeIndex + 1)}
          >
            ›
          </button>
        </div>

        <div className="story-pagination" aria-label="Choose a photo">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              className={`story-dot${index === activeIndex ? ' active' : ''}`}
              type="button"
              aria-label={`Show photo ${index + 1} of ${photos.length}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => showPhoto(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurStory;
