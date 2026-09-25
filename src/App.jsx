import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [opening, setOpening] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [dateRevealed, setDateRevealed] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const invitationRef = useRef(null);
  const scratchCanvasRef = useRef(null);
  const isScratching = useRef(false);

  // =====================================================
  // OPEN INVITATION
  // =====================================================

  const openInvitation = () => {
    setOpening(true);

    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => {
          console.log("Music could not start:", error);
        });
    }
  };

  // =====================================================
  // SCROLL TO DATE SECTION
  // =====================================================

  const continueToInvitation = () => {
    invitationRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =====================================================
  // CREATE SCRATCH CARD
  // =====================================================

  const setupScratchCanvas = () => {
    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);

    // =================================================
    // BURGUNDY SCRATCH COVER
    // =================================================

    const gradient = ctx.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#5d1727");
    gradient.addColorStop(0.5, "#842638");
    gradient.addColorStop(1, "#5d1727");

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      rect.width,
      rect.height
    );

    // =================================================
    // GOLD DECORATIVE PATTERN
    // =================================================

    ctx.fillStyle =
      "rgba(220, 180, 90, 0.18)";

    for (
      let x = 30;
      x < rect.width;
      x += 55
    ) {
      for (
        let y = 30;
        y < rect.height;
        y += 55
      ) {
        ctx.font = "18px Georgia";

        ctx.textAlign = "center";

        ctx.fillText(
          "✦",
          x,
          y
        );
      }
    }

    // =================================================
    // SCRATCH TEXT
    // =================================================

    ctx.fillStyle = "#f2dfae";

    ctx.textAlign = "center";

    ctx.font = "16px Georgia";

    ctx.fillText(
      "SCRATCH",
      rect.width / 2,
      rect.height / 2 - 5
    );

    ctx.font = "10px Arial";

    ctx.fillText(
      "TO REVEAL",
      rect.width / 2,
      rect.height / 2 + 20
    );
  };

  // =====================================================
  // GET MOUSE / TOUCH POSITION
  // =====================================================

  const getPosition = (event) => {
    const canvas = scratchCanvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    let clientX;
    let clientY;

    if (
      event.touches &&
      event.touches.length > 0
    ) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // =====================================================
  // SCRATCH / ERASE
  // =====================================================

  const scratchDate = (event) => {
    if (!isScratching.current) return;

    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const position = getPosition(event);

    if (!position) return;

    const ctx = canvas.getContext("2d");

    ctx.save();

    // This makes the scratched area transparent
    ctx.globalCompositeOperation =
      "destination-out";

    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      35,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    calculateScratchProgress();
  };

  // =====================================================
  // CALCULATE HOW MUCH HAS BEEN SCRATCHED
  // =====================================================

  const calculateScratchProgress = () => {
    const canvas = scratchCanvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let transparentPixels = 0;

    for (
      let i = 3;
      i < imageData.data.length;
      i += 16
    ) {
      if (imageData.data[i] < 50) {
        transparentPixels++;
      }
    }

    const totalPixels =
      imageData.data.length / 16;

    const progress =
      (transparentPixels / totalPixels) * 100;

    const finalProgress = Math.min(
      100,
      progress
    );

    setScratchProgress(finalProgress);

    // ==========================================
    // REVEAL AT 40%
    // ==========================================

    if (
      finalProgress >= 40 &&
      !dateRevealed
    ) {
      setDateRevealed(true);

      // Automatically remove remaining scratch
      setTimeout(() => {
        const canvas =
          scratchCanvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }, 250);
    }
  };

  // =====================================================
  // START SCRATCHING
  // =====================================================

  const startScratch = (event) => {
    event.preventDefault();

    isScratching.current = true;

    scratchDate(event);
  };

  // =====================================================
  // STOP SCRATCHING
  // =====================================================

  const stopScratch = () => {
    isScratching.current = false;
  };

  // =====================================================
  // INITIALIZE SCRATCH CANVAS
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setupScratchCanvas();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  // =====================================================
  // COUNTDOWN
  // =====================================================

  useEffect(() => {
    const targetDate = new Date(
      "2026-10-14T20:00:00+05:30"
    );

    const updateCountdown = () => {
      const now = new Date();

      const difference =
        targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();

    const timer = setInterval(
      updateCountdown,
      1000
    );

    return () => clearInterval(timer);
  }, []);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main
      className={`wedding ${opening ? "is-opening" : ""
        }`}
    >
      <audio
        ref={audioRef}
        src="/music/bg-music-website.mp3"
        loop
        preload="auto"
      />
      {opening && (
        <button
          className="music-toggle"
          onClick={() => {
            if (!audioRef.current) return;

            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(audioRef.current.muted);
          }}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? "🔇" : "♫"}
        </button>
      )}

      {/* =================================================
          OPENING SCREEN
      ================================================= */}

      <section className="opening">

        <img
          src="/images/valima-final.png"
          alt=""
          className="opening-image"
        />

        {/* <div className="gold-border" /> */}

        {/* LEFT DOOR */}

        {/* <div className="door door-left">
          <div className="door-pattern" />
          <div className="door-gold-edge" />
        </div> */}

        {/* RIGHT DOOR */}

        {/* <div className="door door-right">
          <div className="door-pattern" />
          <div className="door-gold-edge" />
        </div> */}

        {/* LIGHT */}

        <div className="door-light" />

        {/* LANTERNS */}

        {/* <div className="lantern left-lantern">
          <div className="flame" />
        </div>

        <div className="lantern right-lantern">
          <div className="flame" />
        </div> */}

        {/* CENTER INVITATION */}

        <div
          className="invitation-center"
          onClick={openInvitation}
        >

          <div className="seal">

            <div className="seal-ring">

              <strong>
                A & R
              </strong>

              <small>
                VALIMA
              </small>

            </div>

          </div>

          <h2>
            Tap to open
          </h2>

          <div className="gold-divider">

            <span />

            <b>
              ✦
            </b>

            <span />

          </div>

          <p>
            OUR WEDDING INVITATION
          </p>

        </div>

        {/* ROSE PETALS */}

        <div className="petals">

          {Array.from({
            length: 20,
          }).map((_, index) => (

            <i key={index}>
              🌹
            </i>

          ))}

        </div>

      </section>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-text">

          {/* BISMILLAH */}

          <div className="hero-bismillah">

            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ

          </div>


          {/* TRANSLATION */}

          <div className="hero-translation">

            In the name of Allah, the Most Gracious,

            <br />

            the Most Merciful

          </div>


          {/* BLESSING */}

          <div className="hero-blessing">

            With the blessings of Allah (SWT),

            <br />

            we request the honour of your presence

            <br />

            at the

          </div>


          {/* EVENT */}

          <div className="hero-event">

            DAWAT-E-VALIMA

          </div>


          <div className="hero-of">

            of

          </div>


          {/* NAMES */}

          <h1>

            <span className="name">

              Arif Ali

            </span>

            <span className="ampersand">

              &

            </span>

            <span className="name">

              Roqayya Fatima

            </span>

          </h1>


          {/* CLOSING */}

                <div className="hero-closing">

                <h2>as they begin their beautiful new chapter and embark upon their forever together</h2>

                <br />

                <h2>.</h2>

                </div>


                {/* DIVIDER */}

          <div className="hero-divider">

            <span />

            ✦

            <span />

          </div>


          {/* CONTINUE */}

          <button
            onClick={continueToInvitation}
          >

            CONTINUE

            <span>
              ↓
            </span>

          </button>

        </div>

      </section>


      {/* =================================================
          SCRATCH TO REVEAL DATE
      ================================================= */}

      <section
        ref={invitationRef}
        className="date-reveal-section"
      >
        {dateRevealed && (
          <div className="petal-shower">
            {Array.from({ length: 40 }).map((_, index) => (
              <span
                key={index}
                className="falling-petal"
                style={{
                  "--left": `${Math.random() * 100}%`,
                  "--delay": `${Math.random() * 1.2}s`,
                  "--duration": `${2.8 + Math.random() * 1.5}s`,
                  "--sway": `${30 + Math.random() * 50}px`,
                  "--rotate": `${Math.random() * 360}deg`,
                  "--size": `${7 + Math.random() * 6}px`,
                }}
              />
            ))}
          </div>
        )}
        <div className="date-reveal-inner">

          {/* ORNAMENT */}

          <div className="date-ornament">

            ✦

          </div>


          {/* TITLE */}

          <p className="date-eyebrow">

            SAVE THE DATE

          </p>


          <h2>

            A beautiful day awaits

          </h2>


          <p className="scratch-instruction">

            Gently scratch the card to reveal
            our special day

          </p>


          {/* =================================================
              SCRATCH CARD
          ================================================= */}

          <div className="scratch-card">

            {/* DATE BEHIND THE SCRATCH LAYER */}

            <div className="date-content">

              <span className="date-small">

                THE DAY

              </span>


              <div className="date-number">

                14

              </div>


              <div className="date-month">

                OCTOBER

              </div>


              <div className="date-year">

                2026

              </div>


              <div className="date-location">

                BANGALORE

              </div>

            </div>


            {/* SCRATCH CANVAS */}

            <canvas
              ref={scratchCanvasRef}
              className="scratch-canvas"

              onMouseDown={startScratch}
              onMouseMove={scratchDate}
              onMouseUp={stopScratch}
              onMouseLeave={stopScratch}

              onTouchStart={startScratch}
              onTouchMove={scratchDate}
              onTouchEnd={stopScratch}
            />

          </div>


          {/* =================================================
              SCRATCH HINT
          ================================================= */}

          <div
            className={`scratch-hint ${dateRevealed ? "hidden" : ""
              }`}
          >

            <span>
              ✦
            </span>

            Drag your finger or mouse
            across the card

            <span>
              ✦
            </span>

          </div>


          {/* =================================================
              REVEALED MESSAGE
          ================================================= */}

          <div
            className={`revealed-message ${dateRevealed ? "show" : ""
              }`}
          >

            <div className="revealed-line">

              ✦

            </div>


            <p>

              We can't wait to celebrate

              <br />

              this beautiful beginning with you.

            </p>


            <div className="revealed-line">

              ✦

            </div>

          </div>

        </div>

      </section>
      {/* =====================================================
    COUNTDOWN
===================================================== */}

      <section className="countdown-section">

        <div className="countdown-inner">

          <div className="countdown-ornament">
            ✦
          </div>

          <p className="countdown-eyebrow">
            Until we welcome you at the Valima
          </p>

          <h2>
            Counting every heartbeat
          </h2>

          <div className="countdown-divider">
            <span />
            ✦
            <span />
          </div>


          {/* COUNTDOWN */}

          <div className="countdown-grid">

            <div className="countdown-box">
              <strong>
                {String(countdown.days).padStart(2, "0")}
              </strong>

              <span>
                DAYS
              </span>
            </div>


            <div className="countdown-box">
              <strong>
                {String(countdown.hours).padStart(2, "0")}
              </strong>

              <span>
                HOURS
              </span>
            </div>


            <div className="countdown-box">
              <strong>
                {String(countdown.minutes).padStart(2, "0")}
              </strong>

              <span>
                MINUTES
              </span>
            </div>


            <div className="countdown-box">
              <strong>
                {String(countdown.seconds).padStart(2, "0")}
              </strong>

              <span>
                SECONDS
              </span>
            </div>

          </div>


          <div className="countdown-date">
            14 · OCTOBER · 2026
          </div>


          <div className="countdown-location">
            BANGALORE
          </div>

        </div>

      </section>

      {/* =====================================================
    EVENT TIMELINE
===================================================== */}

      <section className="events-section">

        <div className="events-inner">

          <p className="events-eyebrow">
            THE CELEBRATION
          </p>

          <h2>
            Our Valima Evening
          </h2>

          <div className="events-divider">
            <span />
            ◇
            <span />
          </div>


          <div className="event-timeline">

            {/* EVENT 1 */}

            <div className="event-item">

              <div className="event-time">
                7:00 PM
              </div>

              <div className="event-marker">
                <span />
              </div>

              <div className="event-content">

                <h3>
                  Guest Arrival
                </h3>

                <p>
                  Welcome & gathering
                </p>

              </div>

            </div>


            {/* EVENT 2 */}

            <div className="event-item">

              <div className="event-time">
                7:30 PM
              </div>

              <div className="event-marker">
                <span />
              </div>

              <div className="event-content">

                <h3>
                  Bride & Groom Entry
                </h3>

                <p>
                  A beautiful beginning
                </p>

              </div>

            </div>


            {/* EVENT 3 */}

            <div className="event-item">

              <div className="event-time">
                8:00 PM
              </div>

              <div className="event-marker">
                <span />
              </div>

              <div className="event-content">

                <h3>
                  Blessings & Dua
                </h3>

                <p>
                  With prayers and blessings
                </p>

              </div>

            </div>


            {/* EVENT 4 */}

            <div className="event-item">

              <div className="event-time">
                8:30 PM
              </div>

              <div className="event-marker">
                <span />
              </div>

              <div className="event-content">

                <h3>
                  Dinner
                </h3>

                <p>
                  A feast shared with love
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* =====================================================
    VENUE SECTION
===================================================== */}

      <section className="venue-section">

        <div className="venue-inner">

          <div className="venue-ornament">
            ✦
          </div>

          <p className="venue-eyebrow">
            THE VENUE
          </p>

          <h2>
            CMA PALACE
          </h2>

          <div className="venue-subtitle">
            Convention & Wedding Hall
          </div>

          <div className="venue-divider">
            <span />
            ◇
            <span />
          </div>

          <div className="venue-icon">
            ✦
          </div>

          <p className="venue-address">
            Hegde Nagar
            <br />
            Next to Haj Bhavan
            <br />
            Bangalore
          </p>

          <p className="venue-description">
            We look forward to welcoming you
            <br />
            to an evening filled with love,
            <br />
            blessings and celebration.
          </p>

          <a
            href="https://maps.app.goo.gl/toCthDaFwgvgp1M88"
            target="_blank"
            rel="noopener noreferrer"
            className="venue-button"
          >
            <span className="venue-button-icon">
              ↗
            </span>

            VIEW LOCATION
          </a>

        </div>

      </section>
      <section className="dress-code-section">
        <div className="dress-code-inner">

          <div className="dress-code-content">
            <p className="dress-code-eyebrow">DRESS CODE</p>

            <h2>Festive Formal</h2>

            <p className="dress-code-description">
              Come dressed in what makes you feel your best. Traditional and formal attire is encouraged, with sarees, lehengas, anarkalis, sherwanis, kurtas, suits and elegant dresses all welcome.

              Most importantly, wear what you love, feel comfortable, and celebrate with us.
            </p>
          </div>

          <div className="dress-code-colors">
            <div
              className="dress-color"
              style={{ "--dress-color": "#3d050d" }}
            />

            <div
              className="dress-color"
              style={{ "--dress-color": "#730b19" }}
            />

            <div
              className="dress-color"
              style={{ "--dress-color": "#a80f20" }}
            />

            <div
              className="dress-color"
              style={{ "--dress-color": "#c59b52" }}
            />

            <div
              className="dress-color"
              style={{ "--dress-color": "#f0e2c9" }}
            />
          </div>

        </div>
      </section>
      <section className="closing-section">
        <div className="closing-overlay" />

        <div className="closing-inner">
          <div className="closing-ornament">✦</div>

          <p className="closing-eyebrow">WITH LOVE & BLESSINGS</p>

          <h2>
            We can't wait to<br />
            celebrate with you
          </h2>

          <div className="closing-divider">
            <span />
            ◇
            <span />
          </div>

          <p className="closing-message">
            Your presence will make our celebration
            <br />
            even more special.
          </p>

          <div className="closing-names">
            Arif Ali
            <span>&</span>
            Roqayya Fatima
          </div>

          <div className="closing-date">
            14 · OCTOBER · 2026
          </div>

          <div className="closing-ornament-bottom">
            ✦
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;