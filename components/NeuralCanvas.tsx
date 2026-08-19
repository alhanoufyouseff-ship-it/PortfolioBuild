'use client';

import { useEffect, useRef } from 'react';
import type { ColorScheme } from '@/lib/types';

const COLOR_MAP: Record<ColorScheme, [number, number, number]> = {
  blue: [37, 99, 235],
  purple: [147, 51, 234],
  'blue-purple': [99, 102, 241],
  green: [16, 185, 129],
  pink: [219, 39, 119],
  'black-white': [220, 225, 235]
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulseSpeed: number;
  pulseAngle: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.9;
    this.vy = (Math.random() - 0.5) * 0.9;
    this.radius = Math.random() * 2 + 1.2;
    this.baseRadius = this.radius;
    this.pulseSpeed = 0.02 + Math.random() * 0.03;
    this.pulseAngle = Math.random() * Math.PI * 2;
  }

  update(width: number, height: number, mouse: { x: number | null; y: number | null; radius: number }) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.pulseAngle += this.pulseSpeed;
    this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.8;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 2.2;
        this.y -= Math.sin(angle) * force * 2.2;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, rgb: [number, number, number]) {
    const [r, g, b] = rgb;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function NeuralCanvas({ colorScheme = 'blue-purple' }: { colorScheme?: ColorScheme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef<[number, number, number]>(COLOR_MAP[colorScheme]);

  useEffect(() => {
    colorRef.current = COLOR_MAP[colorScheme] ?? COLOR_MAP['blue-purple'];
  }, [colorScheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 180 };
    let rafId = 0;

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 12000), 90);
      for (let i = 0; i < count; i++) particles.push(new Particle(width, height));
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      if (!canvas) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function connectParticles() {
      if (!ctx) return;
      const rgb = colorRef.current;
      const [r, g, b] = rgb;
      const maxDistance = 135;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.65;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.update(width, height, mouse);
        p.draw(ctx, colorRef.current);
      }
      connectParticles();
      rafId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }
    function onTouchEnd() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-70"
      aria-hidden="true"
    />
  );
}
