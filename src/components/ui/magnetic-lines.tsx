
"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MagneticLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  particleColor?: string;
  lineColor?: string;
}

const MagneticLines: React.FC<MagneticLinesProps> = ({ className, particleColor = 'hsl(var(--primary))', lineColor = 'hsl(var(--accent))', ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = {
    x: 0,
    y: 0
  };

  class Particle {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;

    constructor(x: number, y: number, private color: string, private canvas: HTMLCanvasElement) {
      this.x = x;
      this.y = y;
      this.size = 2;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = 100;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < 100) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasSize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }
    }
    setCanvasSize();


    let particlesArray: Particle[] = [];

    const init = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.height * canvas.width) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        let x = (Math.random() * canvas.width);
        let y = (Math.random() * canvas.height);
        particlesArray.push(new Particle(x, y, particleColor, canvas));
      }
    };
    init();

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
            ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `hsla(var(--accent-hsl), ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw(ctx);
        particlesArray[i].update();
      }
      connect();
      requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      if(canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
      }
    };
    
    const handleMouseOut = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    const handleResize = () => {
        setCanvasSize();
        init();
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseout', handleMouseOut);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseout', handleMouseOut);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [particleColor, lineColor]);

  return (
    <div className={cn("absolute inset-0 -z-10", className)} {...props}>
        <canvas ref={canvasRef} />
    </div>
  );
};

export { MagneticLines };
