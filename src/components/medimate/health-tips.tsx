import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Droplets, UtensilsCrossed, Dumbbell, BedDouble, Smile, Sun } from 'lucide-react';

const healthTips = [
  {
    icon: Droplets,
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water a day to keep your body functioning optimally. Water helps regulate body temperature, transport nutrients, and remove waste.",
    color: "text-blue-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Eat a Balanced Diet",
    content: "Incorporate a variety of fruits, vegetables, lean proteins, and whole grains into your meals. A balanced diet provides essential nutrients for energy and health.",
    color: "text-green-500",
  },
  {
    icon: Dumbbell,
    title: "Exercise Regularly",
    content: "Aim for at least 30 minutes of moderate physical activity most days of the week. Regular exercise boosts your immune system and improves mood.",
    color: "text-red-500",
  },
  {
    icon: BedDouble,
    title: "Get Enough Sleep",
    content: "Most adults need 7-9 hours of quality sleep per night. Sleep is crucial for physical and mental recovery, memory consolidation, and overall health.",
    color: "text-purple-500",
  },
  {
    icon: Smile,
    title: "Manage Stress",
    content: "Practice stress-reducing activities like meditation, deep breathing, yoga, or spending time in nature. Chronic stress can negatively impact your health.",
    color: "text-pink-500",
  },
  {
    icon: Sun,
    title: "Get Some Sunlight",
    content: "Spend a short amount of time in the sun each day to help your body produce Vitamin D, which is essential for bone health and immune function. Don't forget sunscreen!",
    color: "text-yellow-500",
  },
];

export default function HealthTips() {
  return (
    <div className="animate-in fade-in-50">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline">Daily Health & Wellness Tips</h2>
            <p className="text-muted-foreground mt-2">Simple reminders for a healthier, happier you.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {healthTips.map((tip, index) => (
            <Card key={index} className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <div className="p-3 bg-secondary rounded-full">
                    <tip.icon className={`h-6 w-6 ${tip.color}`} />
                </div>
                <CardTitle>{tip.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{tip.content}</p>
            </CardContent>
            </Card>
        ))}
        </div>
    </div>
  );
}
