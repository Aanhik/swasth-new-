
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  medicine: z.string().min(2, {
    message: 'Medicine name must be at least 2 characters.',
  }),
});

interface PriceData {
    medicine: string;
    pharmacy: string;
    price: string;
    logoUrl: string;
    url: string;
}

const mockPriceData: PriceData[] = [
    { medicine: 'Paracetamol 500mg', pharmacy: 'Netmeds', price: 'Rs. 20.00', logoUrl: 'https://placehold.co/100x40/e2f0ff/1d4ed8?text=Netmeds&font=sans', url: '#' },
    { medicine: 'Paracetamol 500mg', pharmacy: 'Apollo Pharmacy', price: 'Rs. 22.50', logoUrl: 'https://placehold.co/100x40/dcfce7/166534?text=Apollo&font=sans', url: '#' },
    { medicine: 'Paracetamol 500mg', pharmacy: '1mg', price: 'Rs. 19.50', logoUrl: 'https://placehold.co/100x40/fefce8/ef4444?text=1mg&font=sans', url: '#' },
    { medicine: 'Aspirin 75mg', pharmacy: 'Netmeds', price: 'Rs. 15.00', logoUrl: 'https://placehold.co/100x40/e2f0ff/1d4ed8?text=Netmeds&font=sans', url: '#' },
    { medicine: 'Aspirin 75mg', pharmacy: 'Apollo Pharmacy', price: 'Rs. 14.50', logoUrl: 'https://placehold.co/100x40/dcfce7/166534?text=Apollo&font=sans', url: '#' },
    { medicine: 'Aspirin 75mg', pharmacy: '1mg', price: 'Rs. 16.00', logoUrl: 'https://placehold.co/100x40/fefce8/ef4444?text=1mg&font=sans', url: '#' },
];

export default function PriceComparison() {
  const [results, setResults] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicine: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSearched(true);
    // Simulate API call
    setTimeout(() => {
      const filteredData = mockPriceData.filter(item => 
        item.medicine.toLowerCase().includes(values.medicine.toLowerCase())
      );
      setResults(filteredData);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50">
      <Card>
        <CardHeader>
          <CardTitle>Medicine Price Comparison</CardTitle>
          <CardDescription>Enter the name of a medicine to compare prices across different online pharmacies.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="medicine"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Medicine Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2 hidden md:inline">Search</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Searching for best prices...</p>
        </div>
      )}

      {!isLoading && searched && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>
              {results.length > 0 ? `Showing prices for "${form.getValues('medicine')}".` : `No results found for "${form.getValues('medicine')}".`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
                <div className="space-y-4">
                    {results.map((item, index) => (
                        <Card key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <Image src={item.logoUrl} alt={`${item.pharmacy} logo`} width={80} height={32} className="object-contain" />
                                <div>
                                    <p className="font-semibold">{item.pharmacy}</p>
                                    <p className="text-sm text-muted-foreground">{item.medicine}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <p className="text-lg font-bold text-primary">{item.price}</p>
                                <Button asChild size="sm">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        Buy Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>Try searching for another medicine, e.g., "Aspirin".</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
