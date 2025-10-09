"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

const appointmentSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  doctor: z.string({ required_error: 'Please select a doctor.' }),
  date: z.date({ required_error: 'An appointment date is required.' }),
  message: z.string().max(500, 'Message cannot exceed 500 characters.').optional(),
});

export default function AppointmentBooking() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof appointmentSchema>) {
    console.log("Appointment Booked:", values);
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${values.doctor} on ${format(values.date, "PPP")} is confirmed.`,
      variant: 'default',
      className: 'bg-accent text-accent-foreground border-green-300'
    });
    setIsSubmitted(true);
    form.reset();
  }
  
  if (isSubmitted) {
    return (
        <Alert className="bg-accent/50 border-accent animate-in fade-in-50">
            <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
            <AlertTitle className='text-accent-foreground font-bold'>Appointment Confirmed!</AlertTitle>
            <AlertDescription className='text-accent-foreground'>
                Your appointment has been successfully booked. You will receive a confirmation email shortly.
                <Button onClick={() => setIsSubmitted(false)} className='mt-4 w-full'>Book Another Appointment</Button>
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto animate-in fade-in-50">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
        <CardDescription>Fill out the form below to schedule your visit. All fields are required unless marked optional.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dr. Emily Carter (Cardiologist)">Dr. Emily Carter (Cardiologist)</SelectItem>
                      <SelectItem value="Dr. Ben Richards (Dermatologist)">Dr. Ben Richards (Dermatologist)</SelectItem>
                      <SelectItem value="Dr. Sarah Jenkins (General Physician)">Dr. Sarah Jenkins (General Physician)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Please provide details about my previous visit.'"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full">
                Confirm Appointment
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
