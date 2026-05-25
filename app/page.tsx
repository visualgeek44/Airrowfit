"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ── Intersection Observer Hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Counter Animation ───────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <div ref={ref} className="stat-number">{count}{suffix}</div>;
}

// ── NavBar ──────────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#projects", label: "Projects" },
    { href: "#why-us", label: "Why Us" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: scrolled ? "12px 48px" : "20px 48px",
      background: scrolled ? "rgba(9,25,41,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(240,90,40,0.15)" : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.4s ease",
    }}>
      <a href="#hero" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/images/logo-white.png"
          alt="Airrowfit"
          width={160}
          height={58}
          style={{ objectFit: "contain", height: "auto" }}
          priority
        />
      </a>

      {/* Desktop nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden-mobile">
        {links.map(l => (
          <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
        ))}
        <a href="#contact" className="btn-primary" style={{ padding: "10px 24px", fontSize: "12px" }}>
          Get in Touch
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
        className="mobile-only"
        aria-label="Toggle menu"
      >
        <div style={{ width: 24, height: 2, background: "white", marginBottom: 5, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
        <div style={{ width: 24, height: 2, background: "white", marginBottom: 5, opacity: menuOpen ? 0 : 1 }} />
        <div style={{ width: 24, height: 2, background: "white", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: "60px",
          left: 0,
          right: 0,
          background: "rgba(9,25,41,0.98)",
          backdropFilter: "blur(16px)",
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link" style={{ fontSize: "16px" }} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: block !important; }
          nav { padding: 14px 24px !important; }
        }
      `}</style>
    </nav>
  );
}

// ── Brand Mark SVG (recreated as inline SVG) ────────────────────────────────
function BrandMark({ size = 120, color = "#F05A28" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 120 106" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top-left piece */}
      <path d="M22 8 C22 8, 10 18, 10 36 C10 48, 16 56, 24 60 L46 46 C40 42, 36 36, 36 28 C36 18, 42 10, 50 6 Z" fill={color} />
      {/* Top-right piece */}
      <path d="M98 8 C98 8, 110 18, 110 36 C110 48, 104 56, 96 60 L74 46 C80 42, 84 36, 84 28 C84 18, 78 10, 70 6 Z" fill={color} />
      {/* Bottom center piece */}
      <path d="M30 68 C30 68, 18 76, 20 90 C21 97, 26 102, 36 104 L84 104 C94 102, 99 97, 100 90 C102 76, 90 68, 90 68 Z" fill={color} />
    </svg>
  );
}

// ── Geometric mesh background pattern ───────────────────────────────────────
function MeshBg() {
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
    }}>
      {/* Large circles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          borderRadius: "50%",
          border: `1px solid rgba(240,90,40,0.07)`,
          width: `${200 + i * 60}px`,
          height: `${200 + i * 60}px`,
          top: `${-10 + (i % 4) * 25}%`,
          right: `${-5 + (i % 3) * 20}%`,
        }} />
      ))}
      {/* Grid dots */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#F05A28" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

// ── HERO SECTION ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, #091929 0%, #0D2235 45%, #122b42 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      paddingTop: 80,
    }}>
      <MeshBg />

      {/* Diagonal accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "55%",
        width: "2px",
        height: "100%",
        background: "linear-gradient(180deg, transparent 0%, rgba(240,90,40,0.3) 40%, rgba(240,90,40,0.1) 80%, transparent 100%)",
        transform: "rotate(8deg)",
        transformOrigin: "top",
      }} />

      {/* Large brand mark watermark */}
      <div style={{
        position: "absolute",
        right: "8%",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: 0.04,
      }}>
        <Image
          src="/images/logo-icon.png"
          alt=""
          width={500}
          height={440}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1200,
        width: "100%",
        padding: "0 48px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 80,
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Left */}
        <div style={{ opacity: 0, animation: "fadeUp 1s 0.2s ease forwards" }}>
          <div className="section-tag" style={{ marginBottom: 24 }}>
            <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
            Since 2014 · South India
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 5vw, 72px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: "-1.5px",
          }}>
            Built for<br />
            <span style={{ color: "var(--orange)" }}>Architecture.</span><br />
            Forged in Metal.
          </h1>

          <p style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.8,
            marginBottom: 40,
            maxWidth: 480,
            fontWeight: 300,
          }}>
            South India's premier architectural metal solutions provider — engineering precision at scale across landmark commercial, infrastructure, and marine projects.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-outline">Get a Quote</a>
          </div>

          {/* Mini stats */}
          <div style={{
            display: "flex",
            gap: 40,
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            {[
              { value: "10+", label: "Years" },
              { value: "500+", label: "Projects" },
              { value: "3", label: "Landmark Sites" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "var(--orange)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Logo display */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          animation: "fadeIn 1.2s 0.5s ease forwards",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "60px 48px",
            backdropFilter: "blur(8px)",
            textAlign: "center",
          }}>
            <Image
              src="/images/logo-white.png"
              alt="Airrowfit Architectural Metal Solutions"
              width={360}
              height={130}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
              priority
            />
            <div style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
              justifyContent: "center",
              opacity: 0.5,
            }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Est. 2014</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>

          {/* Feature tags */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
            {["Precision Engineered", "ISO Quality", "Pan South India"].map(tag => (
              <span key={tag} style={{
                background: "rgba(240,90,40,0.12)",
                border: "1px solid rgba(240,90,40,0.25)",
                color: "rgba(255,255,255,0.75)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 50,
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: 0.4,
        animation: "float 3s ease-in-out infinite",
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "white" }}>Scroll</span>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, white, transparent)" }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          #hero > div > div { grid-template-columns: 1fr !important; gap: 40px !important; padding: 0 24px !important; }
          #hero > div > div > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ── ABOUT SECTION ────────────────────────────────────────────────────────────
function About() {
  const { ref, inView } = useInView();
  return (
    <section id="about" style={{
      padding: "120px 48px",
      background: "var(--white)",
      position: "relative",
      overflow: "hidden",
    }} ref={ref}>
      {/* Orange accent strip */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 5,
        height: "100%",
        background: "linear-gradient(to bottom, var(--orange), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}>
          {/* Left: Visual */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-40px)",
            transition: "all 0.9s ease",
          }}>
            {/* Logo display block */}
            <div style={{
              background: "var(--navy)",
              borderRadius: 16,
              padding: "64px 48px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Mesh watermark */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="mesh2" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="28" fill="none" stroke="#F05A28" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mesh2)" />
                </svg>
              </div>

              <Image
                src="/images/logo-white.png"
                alt="Airrowfit"
                width={340}
                height={123}
                style={{ objectFit: "contain", width: "100%", height: "auto", position: "relative", zIndex: 1 }}
              />

              {/* Orange bar */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "var(--orange)",
              }} />
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 16,
            }}>
              {[
                { n: 10, suffix: "+", label: "Years of Excellence" },
                { n: 500, suffix: "+", label: "Projects Delivered" },
                { n: 50, suffix: "+", label: "Expert Team Members" },
                { n: 3, suffix: "", label: "Landmark Sites" },
              ].map(s => (
                <div key={s.label} style={{
                  background: s.label === "Landmark Sites" ? "var(--orange)" : "var(--navy)",
                  borderRadius: 12,
                  padding: "24px 20px",
                  color: "white",
                }}>
                  <AnimatedNumber target={s.n} suffix={s.suffix} />
                  <div style={{ fontSize: 12, color: s.label === "Landmark Sites" ? "rgba(255,255,255,0.85)" : "var(--text-muted)", marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(40px)",
            transition: "all 0.9s 0.2s ease",
          }}>
            <div className="section-tag" style={{ marginBottom: 20 }}>
              <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
              About Airrowfit
            </div>

            <h2 style={{
              fontSize: "clamp(32px, 3.5vw, 52px)",
              fontWeight: 800,
              color: "var(--navy)",
              lineHeight: 1.15,
              marginBottom: 24,
              letterSpacing: "-1px",
            }}>
              A Decade of<br />
              <span style={{ color: "var(--orange)" }}>Precision & Scale</span>
            </h2>

            <p style={{ fontSize: 17, color: "#4a5568", lineHeight: 1.9, marginBottom: 20 }}>
              Airrowfit is South India's premier architectural metal solutions provider, bringing over a decade of specialized expertise to the region's most ambitious infrastructure and commercial design projects.
            </p>

            <p style={{ fontSize: 17, color: "#4a5568", lineHeight: 1.9, marginBottom: 40 }}>
              Founded by <strong style={{ color: "var(--navy)" }}>Thameem Ansari</strong> and <strong style={{ color: "var(--navy)" }}>Mohammed Anvar</strong>, our work is synonymous with precision engineering, structural integrity, and high-end aesthetic finishes — trusted by some of the region's most iconic developments.
            </p>

            {/* Pillars */}
            {[
              { title: "Heritage of Excellence", desc: "Over a decade executing high-stakes architectural metal projects across South India." },
              { title: "Prestigious Portfolio", desc: "Lulu Mall, Cochin International Airport, and specialized marine & shipyard structures." },
              { title: "Precision & Innovation", desc: "Marrying industrial strength with modern architectural aesthetics and engineering rigor." },
            ].map((p, i) => (
              <div key={p.title} style={{
                display: "flex",
                gap: 20,
                marginBottom: i < 2 ? 24 : 0,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  background: "rgba(240,90,40,0.1)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}>
                  <div style={{ width: 16, height: 16, background: "var(--orange)", borderRadius: 2 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "var(--navy)", marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #about > div > div { grid-template-columns: 1fr !important; gap: 48px !important; padding: 0 !important; }
          #about { padding: 80px 24px !important; }
        }
      `}</style>
    </section>
  );
}

// ── SERVICES SECTION ─────────────────────────────────────────────────────────
function Services() {
  const { ref, inView } = useInView();

  const services = [
    {
      icon: "⬡",
      title: "Architectural Cladding",
      desc: "Premium metal cladding systems for facades, curtain walls, and decorative external surfaces on commercial and institutional buildings.",
      tags: ["Aluminium", "Composite", "Steel"],
    },
    {
      icon: "◈",
      title: "Structural Metalwork",
      desc: "Load-bearing and non-load-bearing structural steel fabrication designed to meet the most demanding engineering specifications.",
      tags: ["Fabrication", "Erection", "Finishing"],
    },
    {
      icon: "◉",
      title: "Roofing Systems",
      desc: "Industrial-grade and architecturally designed metal roofing solutions for airports, malls, and large-span commercial structures.",
      tags: ["Standing Seam", "Sandwich Panel", "GI"],
    },
    {
      icon: "◇",
      title: "Interior Metal Features",
      desc: "Decorative metalwork for interior applications including feature walls, partitions, ceilings, and bespoke architectural elements.",
      tags: ["SS", "Powder Coat", "Anodised"],
    },
    {
      icon: "◆",
      title: "Marine & Shipyard",
      desc: "Specialized metal solutions engineered for marine environments — corrosion-resistant systems built to withstand coastal and shipyard conditions.",
      tags: ["Marine Grade", "Anti-corrosion", "Custom"],
    },
    {
      icon: "◐",
      title: "Custom Fabrication",
      desc: "Bespoke architectural metalwork fabricated to exact project specifications — from concept engineering to final installation and commissioning.",
      tags: ["Design", "Fabricate", "Install"],
    },
  ];

  return (
    <section id="services" style={{
      padding: "120px 48px",
      background: "var(--gray-light)",
      position: "relative",
    }} ref={ref}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 64,
          flexWrap: "wrap",
          gap: 24,
        }}>
          <div>
            <div className="section-tag" style={{ marginBottom: 16 }}>
              <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
              What We Do
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 3.5vw, 52px)",
              fontWeight: 800,
              color: "var(--navy)",
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}>
              Full-Spectrum<br />
              <span style={{ color: "var(--orange)" }}>Metal Solutions</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: 15, color: "#6b7280", lineHeight: 1.8 }}>
            From concept engineering to installation — every discipline under one roof, delivered with South India's most experienced metal solutions team.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}>
          {services.map((s, i) => (
            <div
              key={s.title}
              className="card-hover"
              style={{
                background: "white",
                borderRadius: 16,
                padding: "40px 32px",
                border: "1px solid rgba(0,0,0,0.06)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.7s ${i * 0.1}s ease`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Orange top border on hover */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "var(--orange)",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s ease",
              }} className="service-bar" />

              <div style={{
                width: 52,
                height: 52,
                background: "rgba(240,90,40,0.1)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 20,
                color: "var(--orange)",
                fontWeight: 800,
              }}>{s.icon}</div>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.8, marginBottom: 20 }}>{s.desc}</p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {s.tags.map(t => (
                  <span key={t} style={{
                    background: "rgba(13,34,53,0.06)",
                    color: "var(--navy)",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: 4,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .card-hover:hover .service-bar { transform: scaleX(1) !important; }
        @media (max-width: 900px) {
          #services > div > div:last-child { grid-template-columns: 1fr !important; }
          #services { padding: 80px 24px !important; }
          #services > div > div:first-child { flex-direction: column; align-items: flex-start !important; }
        }
        @media (min-width: 600px) and (max-width: 900px) {
          #services > div > div:last-child { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ── PROJECTS SECTION ──────────────────────────────────────────────────────────
function Projects() {
  const { ref, inView } = useInView();

  const projects = [
    {
      name: "Lulu Mall",
      location: "Kochi, Kerala",
      type: "Commercial Retail",
      desc: "Comprehensive architectural metal cladding, facade systems, and interior metalwork for one of South India's largest shopping and entertainment destinations.",
      highlight: "Flagship Commercial",
      color: "#F05A28",
    },
    {
      name: "Cochin International Airport",
      location: "Kochi, Kerala",
      type: "Aviation Infrastructure",
      desc: "Mission-critical metal roofing, structural cladding, and architectural metalwork for terminal infrastructure at India's first fully solar-powered international airport.",
      highlight: "Aviation Heritage",
      color: "#0D2235",
    },
    {
      name: "Marine & Shipyard Structures",
      location: "Kerala Coast",
      type: "Marine Engineering",
      desc: "Specialized corrosion-resistant metal solutions engineered and fabricated for marine environments — built to withstand extreme coastal and shipyard operating conditions.",
      highlight: "Marine Grade",
      color: "#F05A28",
    },
  ];

  return (
    <section id="projects" style={{
      padding: "120px 48px",
      background: "var(--navy)",
      position: "relative",
      overflow: "hidden",
    }} ref={ref}>
      <MeshBg />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-tag" style={{ marginBottom: 16, justifyContent: "center" }}>
            <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
            Our Work
            <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 3.5vw, 52px)",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
            letterSpacing: "-1px",
          }}>
            Landmark Projects<br />
            <span style={{ color: "var(--orange)" }}>Across South India</span>
          </h2>
        </div>

        {/* Project cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {projects.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 2fr" : "2fr 1fr",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                overflow: "hidden",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.8s ${i * 0.2}s ease`,
              }}
            >
              {/* Number panel */}
              <div style={{
                background: i === 1 ? "var(--orange)" : "rgba(240,90,40,0.12)",
                border: i === 1 ? "none" : "1px solid rgba(240,90,40,0.2)",
                padding: "48px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                order: i % 2 === 0 ? 0 : 1,
              }}>
                <div style={{
                  fontSize: "80px",
                  fontWeight: 800,
                  color: i === 1 ? "rgba(255,255,255,0.3)" : "rgba(240,90,40,0.25)",
                  lineHeight: 1,
                }}>0{i + 1}</div>
                <div>
                  <div style={{
                    display: "inline-block",
                    background: i === 1 ? "rgba(255,255,255,0.2)" : "var(--orange)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    padding: "6px 16px",
                    borderRadius: 4,
                    marginBottom: 12,
                  }}>{p.highlight}</div>
                  <div style={{ fontSize: 12, color: i === 1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>{p.type}</div>
                </div>
              </div>

              {/* Content panel */}
              <div style={{
                padding: "48px 48px",
                order: i % 2 === 0 ? 1 : 0,
              }}>
                <h3 style={{
                  fontSize: "clamp(22px, 2vw, 32px)",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 8,
                  letterSpacing: "-0.5px",
                }}>{p.name}</h3>
                <div style={{
                  fontSize: 13,
                  color: "var(--orange)",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--orange)", display: "inline-block" }} />
                  {p.location}
                </div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, maxWidth: 520 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #projects { padding: 80px 24px !important; }
          #projects > div > div:last-child > div { grid-template-columns: 1fr !important; }
          #projects > div > div:last-child > div > div { order: unset !important; }
        }
      `}</style>
    </section>
  );
}

// ── WHY US SECTION ───────────────────────────────────────────────────────────
function WhyUs() {
  const { ref, inView } = useInView();

  const reasons = [
    {
      num: "01",
      title: "Decade of Trust",
      desc: "10+ years delivering precision architectural metal solutions across South India's most demanding projects — without compromise.",
    },
    {
      num: "02",
      title: "End-to-End Expertise",
      desc: "From design consultancy and engineering to fabrication, installation, and post-project support — under one expert team.",
    },
    {
      num: "03",
      title: "Landmark Portfolio",
      desc: "Our work features on Lulu Mall, Cochin International Airport, and specialized marine/shipyard structures — credentials that speak for themselves.",
    },
    {
      num: "04",
      title: "Precision at Scale",
      desc: "Industrial-grade fabrication capabilities combined with architectural-level attention to detail — meeting both structural and aesthetic requirements.",
    },
    {
      num: "05",
      title: "Collaborative Approach",
      desc: "We work alongside architects, contractors, and developers — integrating seamlessly into complex project timelines and multi-disciplinary teams.",
    },
    {
      num: "06",
      title: "On Time. On Spec.",
      desc: "A reputation built on delivery excellence — meeting project milestones on schedule, within specification, and to the highest quality standard.",
    },
  ];

  return (
    <section id="why-us" style={{
      padding: "120px 48px",
      background: "white",
      position: "relative",
      overflow: "hidden",
    }} ref={ref}>
      {/* Background accent */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "45%",
        height: "100%",
        background: "var(--gray-light)",
        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
          {/* Left */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
            position: "sticky",
            top: 120,
          }}>
            <div className="section-tag" style={{ marginBottom: 20 }}>
              <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
              Why Airrowfit
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 3.5vw, 52px)",
              fontWeight: 800,
              color: "var(--navy)",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: 24,
            }}>
              The Standard<br />Others<br />
              <span style={{ color: "var(--orange)" }}>Measure Against.</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.8, marginBottom: 32 }}>
              In architectural metalwork, reputation is built one precise panel at a time. Here's why South India's largest projects trust Airrowfit.
            </p>

            {/* Brand mark */}
            <div style={{ opacity: 0.15 }}>
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={100}
                height={88}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Right: Reasons grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {reasons.map((r, i) => (
              <div
                key={r.num}
                style={{
                  padding: "36px 32px",
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.6s ${0.1 + i * 0.1}s ease`,
                  position: "relative",
                  overflow: "hidden",
                }}
                className="why-card"
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "var(--orange)",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.35s ease",
                }} className="why-bar" />

                <div style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "rgba(240,90,40,0.12)",
                  lineHeight: 1,
                  marginBottom: 16,
                }}>{r.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 10 }}>{r.title}</h3>
                <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.8 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .why-card:hover .why-bar { transform: scaleX(1) !important; }
        @media (max-width: 900px) {
          #why-us { padding: 80px 24px !important; }
          #why-us > div > div { grid-template-columns: 1fr !important; gap: 40px !important; }
          #why-us > div > div > div:last-child { grid-template-columns: 1fr !important; }
          #why-us > div > div > div:first-child { position: static !important; }
        }
      `}</style>
    </section>
  );
}

// ── CONTACT SECTION ───────────────────────────────────────────────────────────
function Contact() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" style={{
      padding: "120px 48px",
      background: "var(--navy)",
      position: "relative",
      overflow: "hidden",
    }} ref={ref}>
      <MeshBg />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Left */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}>
            <div className="section-tag" style={{ marginBottom: 20 }}>
              <span style={{ display: "block", width: 32, height: 2, background: "var(--orange)", borderRadius: 1 }} />
              Get in Touch
            </div>
            <h2 style={{
              fontSize: "clamp(32px, 3.5vw, 52px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              marginBottom: 24,
            }}>
              Let's Build<br />
              <span style={{ color: "var(--orange)" }}>Something Great.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 48 }}>
              Whether you're an architect, contractor, or developer — our team is ready to discuss your next architectural metal project, large or small.
            </p>

            {/* Contact details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                {
                  icon: "📞",
                  label: "Phone",
                  value: "+91 81299 24 644",
                  sub: "+91 81299 25 655",
                  href: "tel:+918129924644",
                },
                {
                  icon: "✉️",
                  label: "Email",
                  value: "info@airrowfit.com",
                  href: "mailto:info@airrowfit.com",
                },
                {
                  icon: "🌐",
                  label: "Website",
                  value: "airrowfit.com",
                  href: "https://airrowfit.com",
                },
                {
                  icon: "📍",
                  label: "Address",
                  value: "124, Ground Floor, Payyalore, Kollengode",
                  sub: "Palakkad, Kerala 678506",
                },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    background: "rgba(240,90,40,0.15)",
                    border: "1px solid rgba(240,90,40,0.25)",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                    {c.href ? (
                      <a href={c.href} style={{ fontSize: 15, color: "white", fontWeight: 600, textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--orange)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "white")}
                      >{c.value}</a>
                    ) : (
                      <div style={{ fontSize: 15, color: "white", fontWeight: 600 }}>{c.value}</div>
                    )}
                    {c.sub && <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{c.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Follow</span>
              {["Facebook", "Twitter", "Instagram"].map(s => (
                <a key={s} href={`https://www.${s.toLowerCase()}.com/airrowfit`} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--orange)"; e.currentTarget.style.color = "var(--orange)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                >
                  {s[0]}
                </a>
              ))}
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>@airrowfit</span>
            </div>
          </div>

          {/* Right: Card preview */}
          <div style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(40px)",
            transition: "all 0.9s 0.2s ease",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            {/* Business cards */}
            <div style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              transform: "rotate(-2deg)",
              transition: "transform 0.3s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-2deg)")}
            >
              <Image
                src="/images/card1.jpg"
                alt="Thameem Ansari - Airrowfit Business Card"
                width={600}
                height={342}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
              transform: "rotate(1.5deg)",
              transition: "transform 0.3s ease",
              alignSelf: "flex-end",
              width: "85%",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg) scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "rotate(1.5deg)")}
            >
              <Image
                src="/images/card2.jpg"
                alt="Mohammed Anvar - Airrowfit Business Card"
                width={600}
                height={342}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Founders */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Co-Founders</div>
                <div style={{ fontSize: 15, color: "white", fontWeight: 600 }}>Thameem Ansari & Mohammed Anvar</div>
              </div>
              <Image
                src="/images/logo-icon.png"
                alt=""
                width={48}
                height={42}
                style={{ objectFit: "contain", opacity: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact { padding: 80px 24px !important; }
          #contact > div > div { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: "var(--navy-dark)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "40px 48px",
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 24,
      }}>
        <Image
          src="/images/logo-white.png"
          alt="Airrowfit"
          width={140}
          height={51}
          style={{ objectFit: "contain", height: "auto" }}
        />
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
          © {new Date().getFullYear()} Airrowfit. All rights reserved.<br />
          <span style={{ fontSize: 12 }}>Architectural Metal Solutions · Palakkad, Kerala</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["About", "Services", "Projects", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              letterSpacing: 1,
              textTransform: "uppercase",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--orange)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >{l}</a>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          footer > div { justify-content: center; text-align: center; }
          footer > div > div:last-child { display: none; }
        }
      `}</style>
    </footer>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Services />
      <Projects />
      <WhyUs />
      <Contact />
      <Footer />
    </>
  );
}
