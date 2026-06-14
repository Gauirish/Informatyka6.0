'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, ChevronUp, ChevronDown, Minus } from 'lucide-react';

const word = "INFORMATYKA 6.0";

const colleges = [
  { name: "College of Engineering Trivandrum ", points: 0, rankChange: 0 },
  { name: "Government Engineering College Thissur", points: 0, rankChange: 0 },
  { name: "Model Engineering College", points: 0, rankChange: 0 },
  { name: "TKM College of Engineering", points: 0, rankChange: 0 },
  { name: "Government Engineering College Barton Hill", points: 0, rankChange: 0 },
  { name: "NSS College of Engineering Palakkad", points: 0, rankChange: 0 },
  { name: "Mar Athanasius College of Engineering", points: 0, rankChange: 0 },
  { name: "Federal Institute of Science and Technology", points: 0, rankChange: 0 },
  { name: "Rajagiri School of Engineering & Technology", points: 0, rankChange: 0 },
  { name: "SCMS School of Engineering and Technology", points: 0, rankChange: 0 }
];

export default function Home() {
  const router = useRouter();
  const [animationStep, setAnimationStep] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollToLeaderboard = () => {
    const element = document.querySelector('.leaderboard-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Check if user has already seen the intro animation in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      setAnimationStep(4);
      return;
    }

    // Set the flag immediately so that any subsequent reload/navigation skips it
    try {
      sessionStorage.setItem('hasSeenIntro', 'true');
    } catch (e) {
      console.warn('sessionStorage is not available:', e);
    }

    // Stage 1: Trigger immediately (fade in starts)
    setAnimationStep(1);

    // Stage 2: Trigger zoom into the center at 2.8s (after 6.0 is fully loaded)
    const zoomTimeout = setTimeout(() => {
      setAnimationStep(2);
    }, 2800);

    // Stage 3: Fade out intro overlay at 4.1s (after 1.3s of zoom transition)
    const fadeOverlayTimeout = setTimeout(() => {
      setAnimationStep(3);
    }, 4100);

    // Stage 4: Completely remove overlay at 4.7s (600ms of overlay fade-out)
    const removeOverlayTimeout = setTimeout(() => {
      setAnimationStep(4);
    }, 4700);

    return () => {
      clearTimeout(zoomTimeout);
      clearTimeout(fadeOverlayTimeout);
      clearTimeout(removeOverlayTimeout);
    };
  }, []);

  // Background Particle & Fiber Animation Engine
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

    // Track mouse coordinates for subtle gravitational interaction
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

    // Particle configuration
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
        this.vx = (Math.random() - 0.5) * 0.32; // Very slow drift velocity
        this.vy = (Math.random() - 0.5) * 0.32;
        this.baseRadius = Math.random() * 1.5 + 0.6;
        this.radius = this.baseRadius;
        this.colorVal = Math.random();
        this.alpha = Math.random() * 0.45 + 0.15; // Soft opacity ranges
        this.pulseTime = Math.random() * 100;
        this.pulseSpeed = Math.random() * 0.015 + 0.005;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce back from boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle repulsion away from mouse pointer
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

        // Keep drifting speed slow and smooth
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 0.8) {
          this.vx = (this.vx / speed) * 0.8;
          this.vy = (this.vy / speed) * 0.8;
        }

        // Organic pulsing radius
        this.pulseTime += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseTime) * 0.4;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        let color = 'rgba(40, 40, 40,'; // Accent color #282828
        if (this.colorVal < 0.35) {
          color = 'rgba(140, 116, 129,'; // Soft Plum-Grey (visible on white)
        } else if (this.colorVal < 0.7) {
          color = 'rgba(94, 22, 56,'; // Medium Plum
        }
        
        ctx.fillStyle = color + this.alpha + ')';
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Long cosmic waving fiber lines
    const fibers: {
      yRatio: number;
      amplitude: number;
      speed: number;
      phase: number;
      frequency: number;
      color: string;
      lineWidth: number;
    }[] = [];
    const numFibers = 6;
    for (let i = 0; i < numFibers; i++) {
      fibers.push({
        yRatio: 0.15 + (i * 0.14),
        amplitude: Math.random() * 35 + 20,
        speed: Math.random() * 0.002 + 0.001,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.0025 + 0.0012,
        color: i % 2 === 0 ? 'rgba(40, 40, 40, 0.08)' : 'rgba(94, 22, 56, 0.05)',
        lineWidth: Math.random() * 1.2 + 0.6
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Draw waving continuous cosmic fibers in background
      fibers.forEach((fiber) => {
        ctx.beginPath();
        const centerY = height * fiber.yRatio;
        
        for (let x = 0; x < width; x += 12) {
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
        
        // Add glowing bloom to waving fibers
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#282828';
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow glow
      });

      // Update & draw drifting particles
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

  // CSS variables for zoom animation inline styles
  const introOverlayClass = `intro-overlay 
    ${animationStep >= 2 ? 'fade-to-white' : ''} 
    ${animationStep >= 3 ? 'hidden-overlay' : ''}`;

  return (
    <>
      {/* 1. Intro Animation Overlay */}
      {animationStep < 4 && (
        <div className={introOverlayClass}>
          <div 
            className={`intro-text-wrapper ${animationStep >= 2 ? 'zoomed' : ''}`}
          >
            <h1 className="intro-heading">
              {word.split('').map((char, index) => {
                const isGold = index >= 12;
                return (
                  <span 
                    key={index} 
                    className={`intro-letter ${isGold ? 'gold-text' : ''}`}
                    style={char === ' ' ? { width: '0.25em' } : undefined}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
          </div>
        </div>
      )}

      {/* 2. Main Premium Landing Page */}
      <div className={`landing-container ${animationStep >= 3 ? 'visible' : ''}`}>
        
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
            <li><Link href="/" className="nav-link">Home</Link></li>
            <li><Link href="/about" className="nav-link">About</Link></li>
            <li><Link href="/events" className="nav-link">Events</Link></li>
            <li><Link href="/contact" className="nav-link">Contact</Link></li>
          </ul>
          {/* Mobile Menu Button (Hamburger / Morph to Cross) */}
          <button className="menu-toggle-btn" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Hero Cover Section */}
        <main className="landing-hero">
          <canvas ref={canvasRef} className="hero-particles-canvas" />
          <div className="hero-text-block">
            <span className="hero-subheading">Women in Computing presents</span>
            <h1 className="hero-main-title">
              INFORMATYKA <span className="title-gold">6.0</span>
            </h1>
            <p className="hero-description">
              Join us for an exciting series of events, brought to you by the <strong>IEEE Computer Society Kerala Chapter Woman in Computing</strong>. Discover inspiring stories, fresh perspectives, and the latest innovations. It is more than an event - it’s a celebration of ideas, creativity, and the power of community.
            </p>
            <div className="hero-btn-group">
              <button onClick={() => router.push('/know-more')} className="know-more-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="18"
                  height="18"
                  className="question-icon"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>Know more about 6.0</span>
              </button>

              <button className="leaderboard-scroll-btn" onClick={scrollToLeaderboard}>
                <span>Current leaderboard</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  className="leaderboard-arrow-icon"
                >
                  <path d="m21 16-4 4-4-4"/>
                  <path d="M17 20V4"/>
                  <path d="m3 8 4-4 4 4"/>
                  <path d="M7 4v16"/>
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Leaderboard Section */}
        <section className="leaderboard-section" id="events">
          
          <div className="leaderboard-container">
            <h2 className="leaderboard-title">Current Leaderboard</h2>
            <p className="leaderboard-subheading">Who will claim the top spot?</p>
            {/* <div className="leaderboard-list">
              {colleges.map((college, index) => (
                <div key={index} className="leaderboard-card">
                  <div className="leaderboard-rank-wrapper">
                    <span className="leaderboard-rank">
                      {String(1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="leaderboard-college-info">
                    <span className="leaderboard-college-name">
                      {college.name}
                    </span>
                  </div>
                  <div className="leaderboard-points-wrapper">
                    <span className="leaderboard-points">
                      {college.points} pts
                    </span>
                    {college.rankChange > 0 && (
                      <span className="rank-change-up" title={`Gained ${college.rankChange} ranks`}>
                        <ChevronUp size={16} style={{ marginRight: '2px' }} />
                        {college.rankChange}
                      </span>
                    )}
                    {college.rankChange < 0 && (
                      <span className="rank-change-down" title={`Lost ${Math.abs(college.rankChange)} ranks`}>
                        <ChevronDown size={16} style={{ marginRight: '2px' }} />
                        {Math.abs(college.rankChange)}
                      </span>
                    )}
                    {college.rankChange === 0 && (
                      <span className="rank-change-neutral" title="No change in rank">
                        <Minus size={14} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>*/}
          </div>
        </section>



        {/* Footer */}
        <footer className="footer-container">
          <hr className="footer-line" />
          <div className="footer-content">
            <span className="footer-left">Copyright @ 2026 - All rights are reserved</span>
            <span className="footer-right">Computer Society Kerala Chapter 2026</span>
          </div>
        </footer>


        {/* Mobile Full-Screen Menu Overlay */}
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}>
          <ul className="overlay-links">
            <li>
              <Link href="/" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/about" className="overlay-link" onClick={() => setIsMenuOpen(false)}>About</Link>
            </li>
            <li>
              <Link href="/events" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Events</Link>
            </li>
            <li>
              <Link href="/contact" className="overlay-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
}
