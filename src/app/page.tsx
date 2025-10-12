
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, HeartPulse, Scale, Lightbulb } from 'lucide-react';
import { SphereBackground } from '@/components/ui/sphere-background';
import LogoLoop from '@/components/ui/logo-loop';

const Logo = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-4"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      stroke="hsl(var(--destructive))"
      strokeWidth="2"
      fill="hsl(var(--destructive))"
      fillOpacity="0.1"
    />
    <path
      d="M15 10h-2V8a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z"
      fill="hsl(var(--primary))"
    />
  </svg>
);

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

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        const moveX = deltaX * 0.2;
        const moveY = deltaY * 0.2;
        setPosition({ x: moveX, y: moveY });
    };
    
    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            if (!element) return;
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return React.cloneElement(children, {
        ref,
        style: {
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'transform 0.1s ease-out',
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
                  <Logo />
                  <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E1E1E] leading-tight tracking-tight">
                    Welcome to <span className="text-[#6CC551] relative">SWASTH</span>
                  </h1>
              </div>
              <p className="max-w-[600px] text-muted-foreground text-lg leading-relaxed">
                Your friendly AI health assistant. Take control of your health with powerful tools and personalized insights, all in one place.
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
            <SphereBackground sphereColor="hsl(var(--accent-hsl))" />
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

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-[#F8FFF8] to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Start your journey to better health today.
              </h2>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Sign Up Free</Link>
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

    
