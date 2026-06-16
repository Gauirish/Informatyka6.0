'use client';

import { useEffect, useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
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
        color: i % 2 === 0 ? 'rgba(40, 40, 40, 0.08)' : 'rgba(94, 22, 56, 0.05)',
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
              return "INFORMATYKA 6.0".split('').map((char, index) => {
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
            <li><Link href="/events" className="nav-link active">Events</Link></li>
            <li><Link href="/contact" className="nav-link">Contact</Link></li>
          </ul>
          <button className="menu-toggle-btn" aria-label="Toggle Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Events Content */}
        <main className="events-main-container">
          <div className="section-title-wrapper">
            <div className="title-indicator"></div>
            <h1 className="section-title-text">EVENT</h1>
          </div>
          <div className="events-content-block">
            
            <h1 className="coming-soon-title">
              COMING <span className="title-gold">SOON</span>
            </h1>
            <Link href="/" className="back-home-btn">
              Back to Home
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer-container">
          <hr className="footer-line" />
          <div className="footer-content">
            <span className="footer-left">Copyright @ 2026 - All rights are reserved</span>
            <span className="footer-right">IEEE Computer Society Kerala Chapter 2026</span>
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
