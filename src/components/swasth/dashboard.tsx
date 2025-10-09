"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Stethoscope, HeartPulse, CalendarCheck, Scale, Lightbulb, ArrowRight, Upload } from "lucide-react";
import { Button } from '@/components/ui/button';

type View = "dashboard" | "symptom-analyzer" | "medical-advice" | "appointment-booking" | "price-comparison" | "health-tips" | "read-prescription";

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const featureCards = [
  {
    view: "symptom-analyzer" as View,
    title: "Symptom Analyzer",
    description: "Get a list of possible conditions based on your symptoms.",
    icon: Stethoscope,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    view: "medical-advice" as View,
    title: "AI Medical Advice",
    description: "Ask for medical advice and get instant AI-powered suggestions.",
    icon: HeartPulse,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    view: "appointment-booking" as View,
    title: "Book Appointment",
    description: "Schedule your next visit with a healthcare professional easily.",
    icon: CalendarCheck,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    view: "price-comparison" as View,
    title: "Price Comparison",
    description: "Compare medicine prices from various online pharmacies.",
    icon: Scale,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    view: "health-tips" as View,
    title: "Health Tips",
    description: "Get daily tips and reminders to stay healthy and fit.",
    icon: Lightbulb,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    view: "read-prescription" as View,
    title: "Read Prescription",
    description: "Upload a picture of your prescription to digitize it.",
    icon: Upload,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
];

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  return (
    <div className="animate-in fade-in-50">
      <Card className="mb-8 border-2 border-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Welcome to SWASTH!</CardTitle>
          <CardDescription className="text-lg">Your friendly AI health assistant. Here to help you make informed health decisions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select one of the options below to get started.</p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <Card 
            key={feature.view} 
            className="group hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
            onClick={() => setActiveView(feature.view)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              <div className={`p-2 rounded-full ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
