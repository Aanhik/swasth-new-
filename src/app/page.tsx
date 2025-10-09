"use client";

import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Stethoscope, HeartPulse, CalendarCheck, Scale, Lightbulb, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    className="text-primary"
  >
    <path
      d="M17.5 1.917a6.4 6.4 0 0 0-5.5 3.3A6.4 6.4 0 0 0 6.5 1.917 6.8 6.8 0 0 0 0 8.717c0 6.5 8 11.5 12 13.283 4-1.783 12-6.783 12-13.283a6.8 6.8 0 0 0-6.5-6.8Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M15 10h-2V8a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z"
      fill="hsl(var(--destructive))"
    />
  </svg>
);


export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");

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
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-card border-b sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-secondary/50">
                   <Logo />
               </Button>
               <h2 className="text-xl font-bold font-headline">SWASTH</h2>
            </div>
            <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold font-headline text-primary">{viewTitles[activeView]}</h1>
                <SidebarTrigger />
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderView()}
        </main>
      </SidebarInset>
      <Sidebar side="right">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
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
    </SidebarProvider>
  );
}
