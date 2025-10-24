import InstantMap from './InstantMap';
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { fetchDoctors, postAppointment } from '@/lib/api';

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
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [showInstant, setShowInstant] = React.useState(false);
  const [showCollaborated, setShowCollaborated] = React.useState(false);

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  });

  React.useEffect(() => {
    fetchDoctors().then(setDoctors).catch(() => setDoctors([]));
  }, []);

  async function onSubmit(values: z.infer<typeof appointmentSchema>) {
    try {
      const payload = {
        patientName: values.fullName,
        email: values.email,
        doctorId: values.doctor,
        date: values.date,
        symptoms: values.message || ''
      };
      const res = await postAppointment(payload);
      if (res && res.success) {
        toast({
          title: 'Appointment Booked!',
          description: `Your appointment with ${doctors.find(d => d._id === values.doctor)?.name || values.doctor} on ${format(values.date, 'PPP')} is confirmed.`,
          variant: 'default'
        });
        setIsSubmitted(true);
        form.reset();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to book appointment', variant: 'destructive' });
    }
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
    <div>
      {/* Cards for choosing flow */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Instant Doctor Checkup</CardTitle>
            <CardDescription>Find nearby clinics/doctors instantly using a live map.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Detect nearby clinics and call them immediately.</p>
            <Button onClick={() => { setShowInstant(true); setShowCollaborated(false); }}>Find Nearby Clinics</Button>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Collaborated Doctors</CardTitle>
            <CardDescription>Book an appointment with verified Swasth doctors.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Choose from our partnered doctors and book directly.</p>
            <Button onClick={() => { setShowCollaborated(true); setShowInstant(false); }}>Book Now</Button>
          </CardContent>
        </Card>
      </div>

      {/* Instant Map View */}
      {showInstant && (
        <div className="max-w-5xl mx-auto mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Clinics</CardTitle>
              <CardDescription>Click a marker to view clinic details and call.</CardDescription>
            </CardHeader>
            <CardContent>
              <InstantMap />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collaborated Doctors booking form */}
      {showCollaborated && (
        <div className="max-w-2xl mx-auto animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>Book with a Collaborated Doctor</CardTitle>
              <CardDescription>Select a doctor and schedule an appointment.</CardDescription>
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
                            {doctors.map((d: any) => (
                              <SelectItem key={d._id} value={d._id}>{d.name}{d.specialty ? ` — ${d.specialty}` : ''}</SelectItem>
                            ))}
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
                          <FormLabel>Problem / Symptoms</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your symptoms or reason for visit"
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
        </div>
      )}
    </div>
  );
}
