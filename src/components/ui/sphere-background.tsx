
"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SphereBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  sphereColor?: string;
  count?: number;
}

const SphereBackground: React.FC<SphereBackgroundProps> = ({ className, sphereColor = 'hsl(83, 40%, 80%)', count=50, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  class Sphere {
    x: number;
    y: number;
    size: number;
    dx: number;
    dy: number;

    constructor(private canvas: HTMLCanvasElement, private color: string) {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.size = Math.random() * 2 + 1;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = (Math.random() - 0.5) * 0.5;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
        if (this.x > this.canvas.width || this.x < 0) {
            this.dx = -this.dx;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
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


    let spheresArray: Sphere[] = [];

    const init = () => {
      spheresArray = [];
      const numberOfSpheres = (canvas.width * canvas.height) / 8000;
      for (let i = 0; i < numberOfSpheres; i++) {
        spheresArray.push(new Sphere(canvas, sphereColor));
      }
    };
    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < spheresArray.length; i++) {
        spheresArray[i].draw(ctx);
        spheresArray[i].update();
      }
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
        setCanvasSize();
        init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sphereColor]);

  return (
    <div className={cn("absolute inset-0 -z-10", className)} {...props}>
        <canvas ref={canvasRef} />
    </div>
  );
};

export { SphereBackground };
