"use client";

import React, { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Medal, LayoutDashboard, Stethoscope, HeartPulse, CalendarCheck, Scale, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Dashboard from '@/components/medimate/dashboard';
import SymptomAnalyzer from '@/components/medimate/symptom-analyzer';
import MedicalAdvice from '@/components/medimate/medical-advice';
import AppointmentBooking from '@/components/medimate/appointment-booking';
import PriceComparison from '@/components/medimate/price-comparison';
import HealthTips from '@/components/medimate/health-tips';

type View = "dashboard" | "symptom-analyzer" | "medical-advice" | "appointment-booking" | "price-comparison" | "health-tips";

const viewTitles: Record<View, string> = {
    dashboard: "Dashboard",
    "symptom-analyzer": "Symptom Analyzer",
    "medical-advice": "AI Medical Advice",
    "appointment-booking": "Book an Appointment",
    "price-comparison": "Medicine Price Comparison",
    "health-tips": "Health Tips & Reminders",
};

function PageHeader({ title }: { title: string }) {
    const { isMobile, toggleSidebar } = useSidebar();
    return (
        <header className="flex items-center justify-between p-4 bg-card border-b sticky top-0 z-10">
            <h1 className="text-xl md:text-2xl font-bold font-headline text-primary">{title}</h1>
            {isMobile && <SidebarTrigger onClick={toggleSidebar} />}
        </header>
    );
}

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
  ] as const;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-secondary/50">
                <Medal className="w-7 h-7" />
            </Button>
            <h2 className="text-xl font-bold font-headline">MediMate</h2>
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
        <PageHeader title={viewTitles[activeView]} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
