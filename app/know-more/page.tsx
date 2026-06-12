'use client';

import { useEffect, useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';

export default function KnowMorePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Particle & Fiber Animation Engine (Shared)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -9999, y: -9999, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      radius: number;
      colorVal: number;
      alpha: number;
      pulseTime: number;
      pulseSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.32;
        this.vy = (Math.random() - 0.5) * 0.32;
        this.baseRadius = Math.random() * 1.5 + 0.6;
        this.radius = this.baseRadius;
        this.colorVal = Math.random();
        this.alpha = Math.random() * 0.45 + 0.15;
        this.pulseTime = Math.random() * 100;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180 * 0.04;
            this.vx -= (dx / dist) * force;
            this.vy -= (dy / dist) * force;
          }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.8) {
          this.vx = (this.vx / speed) * 0.8;
          this.vy = (this.vy / speed) * 0.8;
        }

        this.pulseTime += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseTime) * 0.4;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        let color = 'rgba(233, 196, 106,'; // Primary Gold
        if (this.colorVal < 0.3) {
          color = 'rgba(253, 224, 71,'; // Light Gold
        } else if (this.colorVal < 0.6) {
          color = 'rgba(196, 157, 68,'; // Darker Gold
        }
        
        ctx.fillStyle = color + this.alpha + ')';
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const fibers: {
      yRatio: number;
      amplitude: number;
      speed: number;
      phase: number;
      frequency: number;
      color: string;
      lineWidth: number;
    }[] = [];
    const numFibers = 4;
    for (let i = 0; i < numFibers; i++) {
      fibers.push({
        yRatio: 0.2 + (i * 0.2),
        amplitude: Math.random() * 30 + 15,
        speed: Math.random() * 0.0015 + 0.0008,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.002 + 0.001,
        color: i % 2 === 0 ? 'rgba(253, 224, 71, 0.08)' : 'rgba(233, 196, 106, 0.08)',
        lineWidth: Math.random() * 1.0 + 0.5
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      fibers.forEach((fiber) => {
        ctx.beginPath();
        const centerY = height * fiber.yRatio;
        for (let x = 0; x < width; x += 15) {
          const angle = x * fiber.frequency + fiber.phase + (time * fiber.speed);
          const y = centerY + Math.sin(angle) * fiber.amplitude + Math.cos(angle * 0.4) * (fiber.amplitude * 0.35);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = fiber.color;
        ctx.lineWidth = fiber.lineWidth;
        ctx.stroke();
      });

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="landing-container visible">
        <canvas ref={canvasRef} className="hero-particles-canvas" />

        {/* Navigation */}
        <header className="nav-header">
          <div className="nav-logo">
            {(() => {
              let delayIndex = 0;
              return "Informatyka 6.0".split('').map((char, index) => {
                const isSpace = char === ' ';
                if (isSpace) {
                  return (
                    <span key={index} style={{ width: '0.22em', display: 'inline-block' }}>
                      &nbsp;
                    </span>
                  );
                }
                const isGold = index >= 12;
                const delay = `${delayIndex * 0.06}s`;
                delayIndex++;
                return (
                  <span 
                    key={index} 
                    className={`logo-letter ${isGold ? 'logo-gold' : ''}`}
                    style={{ animationDelay: delay }}
                  >
                    {char}
                  </span>
                );
              });
            })()}
          </div>
          <ul className="nav-links">
            <li><a href="/" className="nav-link">Home</a></li>
            <li><a href="/about" className="nav-link">About</a></li>
            <li><a href="/events" className="nav-link">Events</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
          <button className="menu-toggle-btn" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Timeline Content */}
        <main className="know-more-container">
          <h1 className="about-main-title">
            INFORMATYKA <span className="title-gold">6.0</span>
          </h1>

          {/* Section 1: Introduction */}
          <div className="info-intro-card">
            <h2 className="info-section-title">What is Informatyka?</h2>
            <p className="info-intro-text">
              Informatyka is the much-anticipated annual flagship event by the <strong>IEEE Computer Society Kerala Chapter Women in Computing (WiC)</strong>. It brings together passionate minds from Student Branch Chapters (SBCs) across the Travancore, Kochi, and Malabar hubs to celebrate technology, innovation, and inclusion. 
              <br /><br />
              It is more than just an event series—it is a space where bold ideas spark, voices are heard, digital literacy is brought to the grassroots, and women in tech are empowered to lead.
            </p>
          </div>

          {/* Section 2: Operational Timeline */}
          <h2 className="timeline-title-main">Event Timeline</h2>
          <div className="timeline-wrapper">

            {/* Phase 1 */}
            <div className="timeline-phase-card">
              <div className="phase-header">
                <span className="phase-number">Phase 1</span>
                <h3 className="phase-title">Event Launch & Onboarding</h3>
                <span className="phase-date">June 2026</span>
              </div>
              <ul className="phase-milestones">
                <li><strong>June 16:</strong> Official Section-wide Kickoff of Informatyka 6.0.</li>
                <li><strong>June 30:</strong> Mandatory execution of exactly one introductory, orientation, or brand-onboarding event by every participating Student Branch Chapter.</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="timeline-phase-card">
              <div className="phase-header">
                <span className="phase-number">Phase 2</span>
                <h3 className="phase-title">Virtual Technical Tracks</h3>
                <span className="phase-date">July 2026</span>
              </div>
              <ul className="phase-milestones">
                <li><strong>July 5:</strong> Onboarding briefing call with all 52 Student Branch Chairs and Women in Computing (WiC) leads regarding Leaderboard metrics and central drive operations.</li>
                <li><strong>July 31:</strong> Compliance deadline for all SBCs to host at least one mandatory Online Technical Event focusing on in-demand domains</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="timeline-phase-card">
              <div className="phase-header">
                <span className="phase-number">Phase 3</span>
                <h3 className="phase-title">Technical Sprints & IEEEXtreme Launch</h3>
                <span className="phase-date">August 2026</span>
              </div>
              <ul className="phase-milestones">
                <li><strong>August 1:</strong> Launch of intensive IEEEXtreme competitive programming training track and mentorship workshops.</li>
                <li><strong>August 31:</strong> Compliance deadline for peak technical metrics.(Each individual SBC must successfully execute a minimum of two technical events)</li>
              </ul>
            </div>

            {/* Phase 4 */}
            <div className="timeline-phase-card">
              <div className="phase-header">
                <span className="phase-number">Phase 4</span>
                <h3 className="phase-title">Launch of Techsavvy & Buildathon</h3>
                <span className="phase-date">September 2026</span>
              </div>
              <ul className="phase-milestones">
                <li><strong>September 1:</strong> Rollout of the state-wide TechSavvy Rural Digital Literacy campaign.</li>
                <li><strong>September 15:</strong> Release of central hackathon problem statements and Phase 1 registrations for the state-wide Buildathon.</li>
                <li><strong>September 30:</strong> Compliance deadline requiring every SBC to execute at least one mandatory event.</li>
              </ul>
            </div>

            {/* Phase 5 */}
            <div className="timeline-phase-card">
              <div className="phase-header">
                <span className="phase-number">Phase 5</span>
                <h3 className="phase-title">Regional Hub Meets & Finale</h3>
                <span className="phase-date">October 2026</span>
              </div>
              <ul className="phase-milestones">
                <li><strong>October 1–20:</strong> In-person regional flagship meets (Travancore Hub, Kochi Hub, and Malabar Hub Meets) featuring panels and and Phase 2 Buildathon final project pitches.</li>
                <li><strong>October 31:</strong> Grand Finale online closing track and crowning the official Informatyka 6.0 Champions!</li>
              </ul>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="footer-container">
          <hr className="footer-line" />
          <div className="footer-content">
            <span className="footer-left">Copyright @ 2026 - All rights are reserved</span>
            <span className="footer-right">Made by CSKS 2026</span>
          </div>
        </footer>

        {/* Mobile Full-Screen Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          <ul className="overlay-links">
            <li>
              <a href="/" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Home</a>
            </li>
            <li>
              <a href="/about" className="overlay-link" onClick={() => setIsMenuOpen(false)}>About</a>
            </li>
            <li>
              <a href="/events" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Events</a>
            </li>
            <li>
              <a href="#contact" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
