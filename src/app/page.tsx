"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, HeartPulse, Scale, Lightbulb } from 'lucide-react';
import LogoLoop from '@/components/ui/logo-loop';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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

// Logo with image + SVG fallback
const LogoBadge: React.FC = () => {
  const [imgErrored, setImgErrored] = React.useState(false);
  return (
  <div className="mb-2 hidden sm:inline-flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm ring-1 ring-[#6CC551]/30 p-1 shadow-sm">
      {!imgErrored ? (
      <Image
        src="/images/logo1.png"
        alt="SWASTH logo"
        width={96}
        height={96}
        className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 select-none"
        priority
        onError={() => setImgErrored(true)}
      />
      ) : (
        <svg
          width="80"
          height="80"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
        >
          <path d="M100 170c-5-4-45-41-60-56C21 95 20 70 35 52c16-19 45-20 63-2l2 2 2-2c18-18 47-17 63 2 15 18 14 43-5 62-15 15-55 52-60 56z" fill="none" stroke="#59A552" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
          <rect x="114" y="86" width="18" height="48" rx="6" fill="#F24242"/>
          <rect x="96" y="104" width="54" height="18" rx="6" fill="#F24242"/>
        </svg>
      )}
    </div>
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
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 border border-[#6CC551] bg-white backdrop-blur-md supports-[backdrop-filter]:bg-white/10 shadow-[0_8px_30px_rgba(108,197,81,0.25)]">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Image
                  src="/favicon.ico"   
                  alt="SWASTH icon"
                  width={30}           
                  height={30}
                  className="object-contain"
                />
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl">SWASTH</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-base">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a>
            <a href="#help" className="text-muted-foreground hover:text-foreground transition-colors">Help</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full -mt-24 py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white via-[#F5FFF5] to-[#E8FDE8] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(108,197,81,0.15),transparent_70%)]" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid items-center gap-10 md:grid-cols-2 md:-mt-4 lg:-mt-6">
              {/* Left: Headline and CTAs */}
              <div className="flex flex-col items-start justify-center space-y-6 text-left md:pl-4 lg:pl-6 xl:pl-10">
                {/* Logo above headline with fallback SVG */}
                <span><LogoBadge /><InteractiveWelcomeText /></span>
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
                <Link
                  href="/home?guest=true"
                  prefetch={true}
                  onMouseEnter={() => router.prefetch('/home')}
                  onFocus={() => router.prefetch('/home')}
                  className="underline text-[#6CC551] hover:text-[#4CAF50]"
                >
                  Continue as Guest
                </Link>
              </div>

              {/* Right: Lottie Animation (iframe embed) */}
              <div className="flex items-center justify-center md:justify-end">
                <div className="w-[360px] h-[340px] sm:w-[420px] sm:h-[400px] md:w-[520px] md:h-[500px] lg:w-[600px] lg:h-[560px] overflow-visible">
                  <DotLottieReact
                    src="lotteanimation/hospital-5(1).lottie"
                    loop
                    autoplay
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 bg-muted/40 relative overflow-hidden">
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
        {/* About Us */}
        <section id="about" className="w-full py-16 md:py-24 bg-white/70">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">About Us</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                SWASTH is your AI-powered health companion. We help you analyze symptoms,
                get personalized guidance, and make informed decisions — all while keeping your
                data private and secure.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section id="contact" className="w-full py-16 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border p-6 bg-white/60 backdrop-blur">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">Reach us anytime.</p>
                <a href="mailto:support@swasth.app" className="text-primary underline mt-2 inline-block">support@swasth.app</a>
              </div>
              <div className="rounded-lg border p-6 bg-white/60 backdrop-blur">
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">Join the discussion.</p>
                <a href="#" className="text-primary underline mt-2 inline-block">Discord</a>
              </div>
              <div className="rounded-lg border p-6 bg-white/60 backdrop-blur">
                <h3 className="font-semibold mb-2">Feedback</h3>
                <p className="text-muted-foreground">Have ideas? Tell us.</p>
                <a href="#" className="text-primary underline mt-2 inline-block">Submit feedback</a>
              </div>
            </div>
          </div>
        </section>

        {/* Help */}
        <section id="help" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center">Help</h2>
              <div className="space-y-4">
                <div className="rounded-lg border p-5">
                  <h3 className="font-semibold">How do I analyze symptoms?</h3>
                  <p className="text-muted-foreground mt-1">Go to Symptom Analyzer, describe your symptoms, and receive instant insights.</p>
                </div>
                <div className="rounded-lg border p-5">
                  <h3 className="font-semibold">Can I use SWASTH without an account?</h3>
                  <p className="text-muted-foreground mt-1">Yes, click Try as Guest from the navbar or hero section.</p>
                </div>
                <div className="rounded-lg border p-5">
                  <h3 className="font-semibold">Is my data private?</h3>
                  <p className="text-muted-foreground mt-1">We follow strict privacy practices and never share your data without consent.</p>
                </div>
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