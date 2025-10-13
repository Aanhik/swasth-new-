"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, HeartPulse, Scale, Lightbulb } from 'lucide-react';
import LogoLoop from '@/components/ui/logo-loop';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Suspense } from 'react';

const InteractiveWelcomeText: React.FC = () => {
    const containerRef = useRef<HTMLHeadingElement>(null);
    const rafRef = useRef<number>();

    const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLHeadingElement>) => {
        if (!containerRef.current) return;
        
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        
        rafRef.current = requestAnimationFrame(() => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            containerRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
            containerRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
        });
    }, []);

    const handleMouseLeave = React.useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        if (!containerRef.current) return;
        containerRef.current.style.setProperty('--mouse-x', '50%');
        containerRef.current.style.setProperty('--mouse-y', '50%');
    }, []);

    return (
        <>
            <style>
                {`
                .interactive-headline {
                    --mouse-x: 50%;
                    --mouse-y: 50%;
                    position: relative;
                }
                .interactive-headline > .text-swasth {
                    color: transparent;
                    background-image: radial-gradient(
                        circle at var(--mouse-x) var(--mouse-y),
                        hsl(var(--primary)) 0%,
                        hsl(106, 58%, 30%) 40%,
                        hsl(106, 58%, 20%) 100%
                    );
                    -webkit-background-clip: text;
                    background-clip: text;
                    transition: background-position 0.2s ease;
                }
                .interactive-headline > .text-welcome {
                    transition: color 0.2s ease;
                }
                `}
            </style>
            <h1
                ref={containerRef}
                className="interactive-headline text-5xl md:text-6xl text-[#1E1E1E] leading-tight tracking-tight flex items-center justify-center flex-wrap"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
               <span className="text-welcome">Welcome&nbsp;to&nbsp;</span><span className="text-swasth font-bold">SWASTH</span>
            </h1>
        </>
    );
};

const features = [
    {
      icon: <Stethoscope className="w-8 h-8 text-primary" />,
      title: "Symptom Analysis",
      description: "Get instant insights into your health symptoms."
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-primary" />,
      title: "AI Medical Advice",
      description: "Ask health questions and get AI-powered answers."
    },
    {
      icon: <Scale className="w-8 h-8 text-primary" />,
      title: "Price Comparison",
      description: "Find the best prices for your medicines."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "Health Tips",
      description: "Daily advice to help you live a healthier life."
    }
];

const MagneticWrapper: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const rafRef = React.useRef<number>();

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!ref.current) return;
        
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        
        rafRef.current = requestAnimationFrame(() => {
            if (!ref.current) return;
            const { clientX, clientY } = e;
            const { width, height, left, top } = ref.current.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            
            const moveX = deltaX * 0.15;
            const moveY = deltaY * 0.15;
            setPosition({ x: moveX, y: moveY });
        });
    }, []);
    
    const handleMouseLeave = React.useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        setPosition({ x: 0, y: 0 });
    }, []);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('mousemove', handleMouseMove, { passive: true });
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (!element) return;
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [handleMouseMove, handleMouseLeave]);

    return React.cloneElement(children, {
        ref,
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'transform 0.15s ease-out',
            willChange: 'transform'
        }
    });
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white via-[#F5FFF5] to-[#E8FDE8] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(108,197,81,0.15),transparent_70%)]" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex items-center gap-4">
                <Suspense fallback={<div className="w-[200px] h-[180px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg animate-pulse" />}>
                  <DotLottieReact
                    src="https://lottie.host/28a2d83f-f294-493b-b4fe-4b8e8f064552/s2wUuOACd3.lottie"
                    loop
                    autoplay
                    style={{ width: '200px', height: '180px' }}
                  />
                </Suspense>
              </div>
              <InteractiveWelcomeText />
              <p className="max-w-[600px] text-muted-foreground text-lg leading-relaxed">
                Your AI health companion — here to understand, guide, and empower your well-being.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <MagneticWrapper>
                    <Button asChild size="lg" className="hover:scale-105 hover:shadow-[0_0_15px_hsl(var(--primary))] transition-all duration-200">
                      <Link href="/login">Login</Link>
                    </Button>
                </MagneticWrapper>
                <Button asChild variant="outline" size="lg" className="hover:scale-105 hover:shadow-[0_0_15px_hsl(var(--primary))] transition-all duration-200">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
               <Link href="/home?guest=true" className="underline text-[#6CC551] hover:text-[#4CAF50]">
                  Continue as Guest
               </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/40 relative overflow-hidden">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features to Empower Your Health</h2>
                        <p className="max-w-[900px] text-muted-foreground text-lg leading-relaxed">
                            SWASTH provides a suite of tools to help you stay informed and proactive about your well-being.
                        </p>
                    </div>
                </div>
                <div className="mt-12">
                    <LogoLoop>
                      {[...features, ...features].map((feature, index) => (
                          <div key={index} className="grid gap-2 p-4 rounded-lg backdrop-blur-sm w-64 flex-shrink-0 hover:shadow-[0_5px_15px_#6CC55133] hover:-translate-y-1 transition-all space-x-8">
                              {feature.icon}
                              <h3 className="text-lg font-bold">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                      ))}
                    </LogoLoop>
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Start your journey to better health today.
              </h2>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/home?guest=true">Try as Guest</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center py-6 border-t">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SWASTH. All rights reserved.</p>
      </footer>
    </div>
  );
}