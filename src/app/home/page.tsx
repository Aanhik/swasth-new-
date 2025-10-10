
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Stethoscope, HeartPulse, CalendarCheck, Scale, Lightbulb, Upload, ArrowLeft, UserPlus, Bot, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import Link from 'next/link';

import Dashboard from '@/components/swasth/dashboard';
import SymptomAnalyzer from '@/components/swasth/symptom-analyzer';
import MedicalAdvice from '@/components/swasth/medical-advice';
import AppointmentBooking from '@/components/swasth/appointment-booking';
import PriceComparison from '@/components/swasth/price-comparison';
import HealthTips from '@/components/swasth/health-tips';
import ReadPrescription from '@/components/swasth/read-prescription';

type View = "dashboard" | "symptom-analyzer" | "medical-advice" | "appointment-booking" | "price-comparison" | "health-tips" | "read-prescription";

const viewTitles: Record<View, string> = {
    dashboard: "Dashboard",
    "symptom-analyzer": "Symptom Analyzer",
    "medical-advice": "AI Medical Advice",
    "appointment-booking": "Book an Appointment",
    "price-comparison": "Medicine Price Comparison",
    "health-tips": "Health Tips & Reminders",
    "read-prescription": "Read Prescription"
};

const Logo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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


const AiAssistant = () => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
  
    const handleSendMessage = () => {
      if (inputValue.trim()) {
        setMessages([...messages, { sender: 'user', text: inputValue }]);
        // Mock bot response
        setTimeout(() => {
          setMessages(prev => [...prev, { sender: 'bot', text: `I am a friendly AI assistant. How can I help you with your health today?` }]);
        }, 500);
        setInputValue('');
      }
    };
  
    useEffect(() => {
      // Auto-scroll to bottom
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, [messages]);
  
    return (
        <Card className="w-80 h-96 flex flex-col shadow-2xl animate-in fade-in-50 zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2 font-headline">
                <Bot className="text-primary" />
                AI Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                    {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'bot' && <Bot className="w-6 h-6 text-primary shrink-0" />}
                        <div className={`rounded-lg px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {msg.text}
                        </div>
                    </div>
                    ))}
                     {messages.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground p-4">
                            Hi there! Ask me anything about your health or how to use the app.
                        </div>
                    )}
                </div>
                </ScrollArea>
            </CardContent>
            <div className="p-2 border-t">
                <div className="flex items-center gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask something..."
                    className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                    <Send className="w-4 h-4" />
                </Button>
                </div>
            </div>
        </Card>
    )
}

function HomeContent() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('guest') === 'true') {
      const timer = setTimeout(() => {
        setShowGuestPopup(true);
      }, 1000); // Delay pop-up by 1 second
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const renderView = () => {
    switch (activeView) {
      case "symptom-analyzer":
        return <SymptomAnalyzer />;
      case "medical-advice":
        return <MedicalAdvice />;
      case "appointment-booking":
        return <AppointmentBooking />;
      case "price-comparison":
        return <PriceComparison />;
      case "health-tips":
        return <HealthTips />;
      case "read-prescription":
        return <ReadPrescription />;
      case "dashboard":
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'symptom-analyzer', label: 'Symptom Analyzer', icon: Stethoscope },
    { id: 'medical-advice', label: 'AI Medical Advice', icon: HeartPulse },
    { id: 'appointment-booking', label: 'Book Appointment', icon: CalendarCheck },
    { id: 'price-comparison', label: 'Price Comparison', icon: Scale },
    { id: 'health-tips', label: 'Health Tips', icon: Lightbulb },
    { id: 'read-prescription', label: 'Read Prescription', icon: Upload },
  ] as const;

  return (
    <SidebarProvider>
      <Sidebar side="left">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
             <Button variant="ghost" size="icon" className="shrink-0 hover:bg-secondary/50">
                <Logo />
            </Button>
            <h2 className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">SWASTH</h2>
          </div>
        </SidebarHeader>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveView(item.id)}
                isActive={activeView === item.id}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-card border-b sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                {activeView !== 'dashboard' && (
                    <Button variant="ghost" size="icon" onClick={() => setActiveView('dashboard')}>
                        <ArrowLeft />
                    </Button>
                )}
                <h1 className="text-xl md:text-2xl font-bold font-headline text-primary">{viewTitles[activeView]}</h1>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView('dashboard')}>
               <h2 className="text-xl font-bold font-headline">SWASTH</h2>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-secondary/50">
                   <Logo />
               </Button>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderView()}
        </main>
      </SidebarInset>
      <Dialog open={showGuestPopup} onOpenChange={setShowGuestPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus />
              Join SWASTH!
            </DialogTitle>
            <DialogDescription>
              Create an account or log in to save your health data and get a personalized experience.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="w-full">
              <Link href="/login" onClick={() => setShowGuestPopup(false)}>Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup" onClick={() => setShowGuestPopup(false)}>Sign Up</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="fixed bottom-4 right-4 z-50">
        {showAiAssistant ? (
            <div className="relative">
                <AiAssistant />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-4 -right-4 rounded-full h-8 w-8"
                    onClick={() => setShowAiAssistant(false)}
                    >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        ) : (
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setShowAiAssistant(true)}
          >
            <Bot className="h-7 w-7" />
          </Button>
        )}
      </div>
    </SidebarProvider>
  );
}


export default function Home() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <HomeContent />
        </React.Suspense>
    )
}
