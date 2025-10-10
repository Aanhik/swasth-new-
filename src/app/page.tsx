
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, HeartPulse, Scale, Lightbulb } from 'lucide-react';

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
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      fill="hsl(var(--primary))"
      fillOpacity="0.1"
    />
    <path
      d="M15 10h-2V8a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z"
      fill="hsl(var(--destructive))"
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

const InteractiveWelcomeText = () => {
    const text = "Welcome to SWASTH";
    const containerRef = React.useRef<HTMLHeadingElement>(null);
  
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
  
      const handleMouseMove = (e: MouseEvent) => {
        const letters = Array.from(container.querySelectorAll('span'));
        for (const letter of letters) {
          const rect = letter.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          const maxDist = 150;
          const scale = Math.max(0, 1 - distance / maxDist);
          const fontWeight = 400 + 500 * scale;
  
          letter.style.transform = `scale(${1 + 0.5 * scale})`;
          letter.style.fontWeight = `${fontWeight}`;
        }
      };
  
      const handleMouseLeave = () => {
        const letters = Array.from(container.querySelectorAll('span'));
        for (const letter of letters) {
          letter.style.transform = 'scale(1)';
          letter.style.fontWeight = '400';
        }
      }
      
      const parent = container.parentElement;
      if (parent) {
        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', handleMouseLeave)
      }
  
      return () => {
        if(parent) {
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, []);
  
    return (
      <h1 ref={containerRef} className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
        {text.split('').map((char, index) => (
          <span key={index} className="inline-block transition-transform duration-100 ease-out" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal'}}>
            {char}
          </span>
        ))}
      </h1>
    );
};


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex items-center gap-4">
                  <Logo />
                  <InteractiveWelcomeText />
              </div>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Your friendly AI health assistant. Take control of your health with powerful tools and personalized insights, all in one place.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
               <Button asChild variant="link" className="px-0">
                  <Link href="/home?guest=true">Continue as Guest &rarr;</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features to Empower Your Health</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            SWASTH provides a suite of tools to help you stay informed and proactive about your well-being.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
                    {features.map((feature, index) => (
                        <div key={index} className="grid gap-2 p-4 rounded-lg hover:bg-card transition-all">
                            {feature.icon}
                            <h3 className="text-lg font-bold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
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
