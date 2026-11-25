import { useEffect, useRef, useState } from "react";

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);
  const canvasRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const mouseRef = useRef({ x: -120, y: -120, active: false });

  // 👉 Mee `public` folder lo unna photo file peru (e.g. "/profile.jpeg" or "/profile.jpg")
  const profileImage = "/profile.jpeg";

  const heroName = "TUMMALA HARSHINI";

  // 1. Custom Mouse Move Symbol (Ring + Sparkle Symbol following cursor)
  useEffect(() => {
    let posX = window.innerWidth * 0.5;
    let posY = window.innerHeight * 0.35;
    let rafId;

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        cursorDotRef.current.style.opacity = "1";
      }
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = "0";
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = "0";
    };

    const followSymbol = () => {
      if (mouseRef.current.active) {
        posX += (mouseRef.current.x - posX) * 0.16;
        posY += (mouseRef.current.y - posY) * 0.16;
        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
          cursorRingRef.current.style.opacity = "1";
        }
      }
      rafId = requestAnimationFrame(followSymbol);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(followSymbol);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  // 2. Decent Butterfly + Soft Subtle Dots over TUMMALA HARSHINI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const particles = Array.from({ length: 65 }, (_, i) => ({
      side: i % 2 === 0 ? -1 : 1,
      seed: i * 0.55,
      rx: 18 + (i % 6) * 14,
      ry: 10 + (i % 4) * 7,
      size: 1.1 + (i % 2) * 0.65,
      colorType: i % 3
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth || 800;
      canvas.height = parent.clientHeight || 140;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawWingSymbol = (x, y, flap) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.82, 0.82);

      [-1, 1].forEach((dir) => {
        ctx.save();
        ctx.scale(dir, 1);
        ctx.rotate(flap * 0.36);

        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(18, -24, 46, -18, 40, 2);
        ctx.bezierCurveTo(35, 12, 11, 7, 0, 2);
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.bezierCurveTo(20, 8, 32, 20, 16, 27);
        ctx.bezierCurveTo(7, 29, 2, 14, 0, 6);
        ctx.closePath();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.65)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      });

      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      t += 0.022;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const bx = w * 0.5 + Math.sin(t * 0.8) * (w * 0.32);
      const by = h * 0.5 + Math.cos(t * 1.5) * 10;
      const flap = Math.sin(t * 7.5);

      particles.forEach((p) => {
        const angle = t * 1.8 + p.seed;
        const px =
          bx +
          p.side * (10 + Math.abs(Math.cos(angle)) * p.rx) +
          Math.cos(t * 1.4 + p.seed) * 7;
        const py = by + Math.sin(angle * 2) * p.ry + flap * 6 * p.side;

        if (p.colorType === 0) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        } else if (p.colorType === 1) {
          ctx.fillStyle = "rgba(244, 63, 94, 0.45)";
        } else {
          ctx.fillStyle = "rgba(251, 191, 36, 0.45)";
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      drawWingSymbol(bx, by, flap);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleDownloadPdf = () => {
    setResumeOpen(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div
      className="portfolio-page"
      onMouseOver={(e) => {
        if (e.target.closest("a, button, .info-card, .stat-box")) {
          setCursorHover(true);
        }
      }}
      onMouseOut={(e) => {
        if (e.target.closest("a, button, .info-card, .stat-box")) {
          setCursorHover(false);
        }
      }}
    >
      <style>{`
        :root {
          --bg: #06050b;
          --card: #131120;
          --border: rgba(251, 113, 133, 0.25);
          --c1: #f43f5e;
          --c2: #a855f7;
          --c3: #f59e0b;
          --text: #ffffff;
          --muted: #cbd5e1;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          scroll-behavior: smooth;
        }

        body {
          background-color: #06050b;
          color: #ffffff;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          overflow-x: hidden;
          line-height: 1.65;
          background-image:
            radial-gradient(circle at 50% 18%, rgba(244, 63, 94, 0.14), transparent 45%),
            radial-gradient(circle at 80% 30%, rgba(168, 85, 247, 0.13), transparent 42%);
        }

        .mouse-symbol-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #f43f5e;
          box-shadow: 0 0 18px rgba(244, 63, 94, 0.45), inset 0 0 10px rgba(168, 85, 247, 0.35);
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mouse-symbol-ring.is-hover {
          width: 56px;
          height: 56px;
          border-color: #f59e0b;
        }

        .mouse-symbol-ring::before,
        .mouse-symbol-ring::after {
          content: "";
          position: absolute;
          background: #f59e0b;
          border-radius: 2px;
        }

        .mouse-symbol-ring::before {
          width: 8px;
          height: 1.5px;
        }

        .mouse-symbol-ring::after {
          width: 1.5px;
          height: 8px;
        }

        .mouse-symbol-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px #f43f5e;
          pointer-events: none;
          z-index: 10000;
          opacity: 0;
        }

        .top-nav {
          max-width: 1200px;
          margin: 14px auto 0;
          padding: 14px 24px;
          border-radius: 999px;
          background: rgba(19, 17, 32, 0.9);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          position: sticky;
          top: 14px;
          z-index: 100;
        }

        .brand {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--text);
          text-decoration: none;
        }

        .brand span {
          color: var(--c1);
        }

        .nav-links {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.74rem;
          letter-spacing: 1.2px;
          font-weight: 700;
        }

        .nav-links a:hover {
          color: var(--c3);
        }

        .nav-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.83rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.25s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--c1), var(--c2), var(--c3));
          color: #ffffff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(244, 63, 94, 0.35);
        }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border-color: var(--border);
        }

        .btn-ghost:hover {
          border-color: var(--c3);
          color: var(--c3);
          transform: translateY(-2px);
        }

        .container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-centered {
          min-height: 82vh;
          padding: 36px 0 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .reel-title-wrap {
          position: relative;
          width: 100%;
          max-width: 1020px;
          min-height: 145px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .wing-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Decent name with smooth shining light sweep */
        .decent-name {
          position: relative;
          z-index: 1;
          font-size: clamp(2rem, 4.8vw, 3.65rem);
          font-weight: 900;
          letter-spacing: 2px;
          line-height: 1.15;
          background: linear-gradient(110deg, #e2e8f0 0%, #ffffff 35%, #fef08a 50%, #f5d0fe 65%, #ffffff 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 14px rgba(251, 191, 36, 0.22));
          animation: nameShineSweep 3.8s linear infinite;
        }

        @keyframes nameShineSweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .hero-sub {
          color: var(--muted);
          font-size: 0.98rem;
          max-width: 680px;
          margin: 0 auto 24px;
        }

        .center-visual-wrap {
          position: relative;
          width: 280px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .orbit-ring-1 {
          position: absolute;
          width: 276px;
          height: 276px;
          border-radius: 50%;
          border: 2px dashed rgba(244, 63, 94, 0.45);
          animation: spinSlow 18s linear infinite;
        }

        .orbit-ring-2 {
          position: absolute;
          width: 248px;
          height: 248px;
          border-radius: 50%;
          border: 1.5px solid rgba(168, 85, 247, 0.4);
          animation: spinReverse 14s linear infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes floatPic {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-9px); }
        }

        .pic-circle {
          position: relative;
          z-index: 2;
          width: 218px;
          height: 218px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--c1);
          box-shadow: 0 0 36px rgba(244, 63, 94, 0.3), 0 16px 36px rgba(0, 0, 0, 0.7);
          animation: floatPic 3.8s ease-in-out infinite;
          background: #131120;
        }

        .pic-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .hero-cta {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .mouse-scroll {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--muted);
          font-size: 0.7rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .mouse-body {
          width: 24px;
          height: 38px;
          border-radius: 999px;
          border: 2px solid var(--c1);
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }

        .mouse-wheel {
          width: 4px;
          height: 7px;
          border-radius: 999px;
          background: var(--c3);
          animation: wheelScroll 1.6s ease-in-out infinite;
        }

        @keyframes wheelScroll {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0.15; transform: translateY(12px); }
        }

        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 10px;
        }

        .stat-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .stat-box:hover {
          transform: translateY(-4px);
          border-color: var(--c1);
        }

        .stat-num {
          font-size: 1.12rem;
          font-weight: 800;
          color: var(--c3);
        }

        .stat-label {
          font-size: 0.72rem;
          letter-spacing: 0.9px;
          color: var(--muted);
          margin-top: 4px;
        }

        section {
          padding: 54px 0;
        }

        .sec-tag {
          font-size: 0.76rem;
          letter-spacing: 2px;
          color: var(--c1);
          font-weight: 700;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .sec-title {
          font-size: clamp(1.65rem, 3vw, 2.3rem);
          margin-bottom: 10px;
          color: #ffffff;
        }

        .sec-title span {
          color: var(--c2);
        }

        .sec-desc {
          color: var(--muted);
          max-width: 680px;
          margin-bottom: 26px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .info-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          border-color: var(--c1);
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.72rem;
          color: var(--c3);
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .info-card h3 {
          font-size: 1.16rem;
          margin-bottom: 6px;
          color: #ffffff;
        }

        .org {
          color: var(--c1);
          font-size: 0.92rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .info-card ul {
          padding-left: 18px;
          color: var(--muted);
          font-size: 0.93rem;
        }

        .info-card ul li {
          margin-bottom: 8px;
        }

        .info-card p {
          color: var(--muted);
          font-size: 0.93rem;
        }

        .pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(168, 85, 247, 0.14);
          border: 1px solid rgba(244, 63, 94, 0.35);
          color: #ffffff;
        }

        .resume-box {
          background: linear-gradient(135deg, rgba(244, 63, 94, 0.13), rgba(168, 85, 247, 0.13));
          border: 1px solid rgba(244, 63, 94, 0.38);
          border-radius: 20px;
          padding: 34px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .contact-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 34px;
          text-align: center;
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 18px;
        }

        footer {
          border-top: 1px solid var(--border);
          padding: 24px 20px;
          text-align: center;
          color: var(--muted);
          font-size: 0.85rem;
          margin-top: 28px;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 5, 11, 0.88);
          backdrop-filter: blur(8px);
          z-index: 999;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .resume-sheet {
          background: #ffffff;
          color: #0f172a;
          width: 100%;
          max-width: 820px;
          border-radius: 16px;
          padding: 36px 40px;
          margin: 20px auto;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65);
        }

        .sheet-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 18px;
        }

        .sheet-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .sheet-print {
          background: #131120;
          color: #ffffff;
        }

        .sheet-close {
          background: #e2e8f0;
          color: #0f172a;
        }

        .resume-sheet h2 {
          font-size: 1.7rem;
          color: #0f172a;
        }

        .resume-sheet .sub-line {
          color: #334155;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .resume-sheet .meta-line {
          font-size: 0.88rem;
          color: #475569;
          padding-bottom: 14px;
          border-bottom: 2px solid #131120;
          margin-bottom: 16px;
        }

        .resume-sheet h4 {
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f172a;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
          margin: 16px 0 8px;
        }

        .resume-sheet p, .resume-sheet li {
          font-size: 0.9rem;
          color: #1e293b;
          line-height: 1.55;
        }

        .resume-sheet ul {
          padding-left: 18px;
          margin-bottom: 8px;
        }

        @media print {
          body * { visibility: hidden; }
          .resume-sheet, .resume-sheet * { visibility: visible; }
          .resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            margin: 0;
            padding: 20px;
          }
          .sheet-actions { display: none; }
        }

        @media (max-width: 860px) {
          .mouse-symbol-ring, .mouse-symbol-dot { display: none; }
          .stats-strip { grid-template-columns: repeat(2, 1fr); }
          .top-nav { border-radius: 22px; flex-direction: column; }
          .nav-links { justify-content: center; gap: 12px; }
          .resume-sheet { padding: 22px; }
        }
      `}</style>

      <div
        ref={cursorRingRef}
        className={`mouse-symbol-ring ${cursorHover ? "is-hover" : ""}`}
        aria-hidden="true"
      />
      <div ref={cursorDotRef} className="mouse-symbol-dot" aria-hidden="true" />

      <header className="top-nav">
        <a href="#hero" className="brand">
          TUMMALA HARSHINI<span>.</span>
        </a>
        <nav className="nav-links">
          <a href="#experience">EXPERIENCE</a>
          <a href="#skills">SKILLS</a>
          <a href="#education">EDUCATION</a>
          <a href="#certifications">CERTIFICATIONS</a>
          <a href="#resume">RÉSUMÉ</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <div className="nav-actions">
          <button type="button" onClick={() => setResumeOpen(true)} className="btn btn-ghost">
            RÉSUMÉ ↓
          </button>
          <a href="#contact" className="btn btn-primary">
            CONNECT
          </a>
        </div>
      </header>

      <main className="container">
        <section id="hero" className="hero-centered">
          <div className="reel-title-wrap">
            <canvas ref={canvasRef} className="wing-canvas" aria-hidden="true" />
            <h1 className="decent-name">{heroName}</h1>
          </div>

          <p className="hero-sub">
            Operations, Healthcare Billing (OPD/IP) &amp; Insurance Claims, GST Billing &amp; Reconciliation,
            MS Excel Reporting, Python, Data Analytics &amp; AI/ML.
          </p>

          <div className="center-visual-wrap">
            <div className="orbit-ring-1" />
            <div className="orbit-ring-2" />
            <div className="pic-circle">
              <img src={profileImage} alt="Tummala Harshini" />
            </div>
          </div>

          <div className="hero-cta">
            <button type="button" onClick={() => setResumeOpen(true)} className="btn btn-primary">
              DOWNLOAD RÉSUMÉ
            </button>
            <a href="#experience" className="btn btn-ghost">
              VIEW EXPERIENCE
            </a>
          </div>

          <a href="#experience" className="mouse-scroll" aria-label="Scroll down">
            <div className="mouse-body">
              <div className="mouse-wheel" />
            </div>
            <span>Scroll Down</span>
          </a>
        </section>

        <div className="stats-strip">
          <div className="stat-box">
            <div className="stat-num">OPD / IP</div>
            <div className="stat-label">HEALTHCARE BILLING</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">GST &amp; LEDGERS</div>
            <div className="stat-label">ACCOUNTS &amp; RECON</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">MS EXCEL</div>
            <div className="stat-label">DATA REPORTING</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">AI / ML &amp; PYTHON</div>
            <div className="stat-label">CERTIFIED SKILLS</div>
          </div>
        </div>

        <section id="experience">
          <div className="sec-tag">01 // Work Experience</div>
          <h2 className="sec-title">
            PROFESSIONAL <span>EXPERIENCE</span>
          </h2>
          <p className="sec-desc">Hands-on operational, healthcare billing, reconciliation, and reporting experience.</p>

          <div className="grid-2">
            <div className="info-card">
              <div className="card-meta">
                <span>HEALTHCARE BILLING &amp; CLAIMS</span>
                <span>ROLE 01</span>
              </div>
              <h3>Office Associate</h3>
              <div className="org">THATHA Hospital</div>
              <ul>
                <li>Managed end-to-end Outpatient (OPD) and Inpatient (IP) billing operations with high accuracy and hospital compliance.</li>
                <li>Processed patient insurance claims documentation, verified medical bills, and coordinated for timely settlements.</li>
                <li>Maintained structured digital and physical billing records, financial logs, and daily collection reports.</li>
              </ul>
            </div>

            <div className="info-card">
              <div className="card-meta">
                <span>ACCOUNTS, GST &amp; ADMIN</span>
                <span>ROLE 02</span>
              </div>
              <h3>Office Associate</h3>
              <div className="org">Siri Power Products Pvt Ltd</div>
              <ul>
                <li>Maintained daily cash book, bank book, and routine financial ledgers with zero-discrepancy reconciliation.</li>
                <li>Prepared GST billing statements, vendor invoices, and routine accounting documents using MS Excel.</li>
                <li>Handled front-office administrative records, data entry, and operational reporting for management workflows.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="skills">
          <div className="sec-tag">02 // Core Competencies &amp; Technical Skills</div>
          <h2 className="sec-title">
            SKILLS &amp; <span>CAPABILITIES</span>
          </h2>
          <p className="sec-desc">Organized across healthcare operations, accounting, office tools, and analytics.</p>

          <div className="grid-2">
            <div className="info-card">
              <h3>Healthcare &amp; Billing</h3>
              <p>Hospital Billing (OPD &amp; IP), Insurance Claims Processing, Patient Record Compliance, Invoice Verification.</p>
              <div className="pills">
                <span className="pill">OPD / IP Billing</span>
                <span className="pill">Insurance Claims</span>
                <span className="pill">Invoice Verification</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Accounts &amp; Finance</h3>
              <p>GST Billing, Cash Book &amp; Bank Book Maintenance, Daily Financial Reconciliation, Voucher &amp; Ledger Management.</p>
              <div className="pills">
                <span className="pill">GST Billing</span>
                <span className="pill">Reconciliation</span>
                <span className="pill">Ledger Management</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Operations &amp; Office</h3>
              <p>MS Excel (Formulas, Reporting, Data Cleanup), MS Word, Data Entry, Administrative Support, Typing &amp; Shorthand.</p>
              <div className="pills">
                <span className="pill">MS Excel</span>
                <span className="pill">MS Word</span>
                <span className="pill">Typing &amp; Shorthand</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Technical &amp; Analytics</h3>
              <p>Python Programming, Data Analytics &amp; Data Science Fundamentals, AI &amp; Machine Learning Concepts, C Language.</p>
              <div className="pills">
                <span className="pill">Python</span>
                <span className="pill">Data Analytics</span>
                <span className="pill">AI &amp; ML</span>
                <span className="pill">C Language</span>
              </div>
            </div>
          </div>
        </section>

        <section id="education">
          <div className="sec-tag">03 // Academic Background</div>
          <h2 className="sec-title">
            EDUCATION <span>DETAILS</span>
          </h2>
          <p className="sec-desc">Academic foundation from school through undergraduate science studies.</p>

          <div className="grid-3">
            <div className="info-card">
              <div className="card-meta">
                <span>DEGREE</span>
                <span>MECS</span>
              </div>
              <h3>B.Sc (MECS)</h3>
              <p>Bala Sai Degree College</p>
            </div>
            <div className="info-card">
              <div className="card-meta">
                <span>INTERMEDIATE</span>
                <span>10+2</span>
              </div>
              <h3>Intermediate (10+2)</h3>
              <p>RK Junior College</p>
            </div>
            <div className="info-card">
              <div className="card-meta">
                <span>SECONDARY</span>
                <span>SSC (10TH)</span>
              </div>
              <h3>SSC (10th)</h3>
              <p>Little Flower High School</p>
            </div>
          </div>
        </section>

        <section id="certifications">
          <div className="sec-tag">04 // Certifications &amp; Languages</div>
          <h2 className="sec-title">
            CREDENTIALS &amp; <span>LANGUAGES</span>
          </h2>
          <p className="sec-desc">Training certifications and spoken language proficiencies.</p>

          <div className="grid-2">
            <div className="info-card">
              <h3>Certifications</h3>
              <ul>
                <li>AI &amp; Machine Learning Certification</li>
                <li>Data Science &amp; Data Analytics Training</li>
                <li>Python Programming &amp; C Language</li>
                <li>MS Office &amp; Aptech Computer Education</li>
                <li>Typing &amp; Shorthand Certification</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>Languages</h3>
              <p>Fluent communication for team coordination, documentation, and client/patient support.</p>
              <div className="pills">
                <span className="pill">Telugu</span>
                <span className="pill">English</span>
              </div>
            </div>
          </div>
        </section>

        <section id="resume">
          <div className="sec-tag">05 // Curriculum Vitae</div>
          <div className="resume-box">
            <div>
              <h2 className="sec-title" style={{ marginBottom: 6 }}>
                VIEW &amp; DOWNLOAD <span>RÉSUMÉ</span>
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: 560 }}>
                Complete resume with work experience at THATHA Hospital &amp; Siri Power Products Pvt Ltd,
                education, and technical certifications.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setResumeOpen(true)} className="btn btn-ghost">
                VIEW RÉSUMÉ
              </button>
              <button type="button" onClick={handleDownloadPdf} className="btn btn-primary">
                DOWNLOAD RÉSUMÉ (PDF)
              </button>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="contact-card">
            <div className="sec-tag">06 // Contact</div>
            <h2 className="sec-title">
              GET IN <span>TOUCH</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 600, margin: "0 auto" }}>
              Seeking an Operations, Healthcare Claims, Accounts, or Data Operations Associate role in Secunderabad / Hyderabad.
            </p>
            <div className="contact-info">
              <a href="mailto:harshinitummala555@gmail.com" className="btn btn-primary">
                harshinitummala555@gmail.com
              </a>
              <a href="tel:+919347583906" className="btn btn-ghost">
                +91 9347583906
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>© 2026 Tummala Harshini • Secunderabad / Hyderabad, Telangana</footer>

      {resumeOpen && (
        <div className="modal-overlay" onClick={() => setResumeOpen(false)}>
          <div className="resume-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-actions">
              <button type="button" onClick={() => window.print()} className="sheet-btn sheet-print">
                Save / Print PDF
              </button>
              <button type="button" onClick={() => setResumeOpen(false)} className="sheet-btn sheet-close">
                Close ✕
              </button>
            </div>
            <h2>T. HARSHINI</h2>
            <div className="sub-line">Operations, Healthcare Billing &amp; Accounts Associate | Data Analytics</div>
            <div className="meta-line">
              Phone: +91 9347583906 | Email: harshinitummala555@gmail.com | Location: Secunderabad / Hyderabad, Telangana
            </div>

            <h4>Professional Summary</h4>
            <p>
              Detail-oriented Operations and Accounts Associate with hands-on experience in healthcare billing
              operations (OPD/IP), insurance claims processing, GST billing, cash and bank book reconciliation,
              and administrative data management. Proficient in MS Excel, financial documentation, and data reporting,
              with certified training in Python, Data Analytics, and AI &amp; Machine Learning.
            </p>

            <h4>Core Competencies &amp; Technical Skills</h4>
            <ul>
              <li><strong>Healthcare &amp; Billing:</strong> Hospital Billing (OPD &amp; IP), Insurance Claims Processing, Patient Record Compliance, Invoice Verification</li>
              <li><strong>Accounts &amp; Finance:</strong> GST Billing, Cash Book &amp; Bank Book Maintenance, Daily Financial Reconciliation, Voucher &amp; Ledger Management</li>
              <li><strong>Operations &amp; Office:</strong> MS Excel (Formulas, Reporting, Data Cleanup), MS Word, Data Entry, Administrative Support, Typing &amp; Shorthand</li>
              <li><strong>Technical &amp; Analytics:</strong> Python Programming, Data Analytics &amp; Data Science Fundamentals, AI &amp; Machine Learning Concepts, C Language</li>
            </ul>

            <h4>Work Experience</h4>
            <p><strong>Office Associate — THATHA Hospital</strong></p>
            <ul>
              <li>Managed end-to-end Outpatient (OPD) and Inpatient (IP) billing operations with high accuracy and adherence to hospital compliance standards.</li>
              <li>Processed patient insurance claims documentation, verified medical bills, and coordinated with internal teams for timely claim settlements.</li>
              <li>Maintained structured digital and physical patient billing records, financial logs, and daily collection reports.</li>
            </ul>
            <p><strong>Office Associate — Siri Power Products Pvt Ltd</strong></p>
            <ul>
              <li>Maintained daily cash book, bank book, and routine financial transaction ledgers with zero-discrepancy reconciliation.</li>
              <li>Prepared GST billing statements, vendor invoices, and routine accounting documentation using MS Excel and office tools.</li>
              <li>Handled front-office administrative records, data entry, and operational reporting to support management workflows.</li>
            </ul>

            <h4>Education</h4>
            <ul>
              <li><strong>B.Sc (MECS)</strong> — Bala Sai Degree College</li>
              <li><strong>Intermediate (10+2)</strong> — RK Junior College</li>
              <li><strong>SSC (10th)</strong> — Little Flower High School</li>
            </ul>

            <h4>Certifications &amp; Languages</h4>
            <ul>
              <li>AI &amp; Machine Learning Certification | Data Science &amp; Data Analytics Training | Python Programming &amp; C Language | MS Office &amp; Aptech Computer Education | Typing &amp; Shorthand Certification</li>
              <li><strong>Languages:</strong> Telugu, English</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}