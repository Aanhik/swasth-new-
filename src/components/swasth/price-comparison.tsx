"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { fetchMedicines } from '@/lib/api';

const formSchema = z.object({
  medicine: z.string().min(2, {
    message: 'Medicine name must be at least 2 characters.',
  }),
});

export default function PriceComparison() {
  const [allMedicines, setAllMedicines] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchMedicines().then(setAllMedicines).catch(() => setAllMedicines([]));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicine: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSearched(true);
    setTimeout(() => {
      const filtered = allMedicines.filter(
        item => item.name.toLowerCase().includes(values.medicine.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
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
            {results.length > 0
              ? `Showing prices for "${form.getValues('medicine')}".`
              : `No results found for "${form.getValues('medicine')}".`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            results.map((item, index) => (
              <div key={index} className="flex flex-col gap-6 mb-8">
                <div className="text-lg font-bold mb-2">{item.name}</div>
                <div className="flex flex-row gap-6 justify-center">
                  {/* Apollo Card */}
                  <Card className="flex-1 max-w-xs flex flex-col items-center p-4 shadow-md h-56 justify-between">
                    <div className="flex-grow flex flex-col items-center justify-center w-full">
                      <Image src="/images/apollo.png" alt="Apollo logo" width={100} height={40} className="object-contain mb-2" />
                      <div className="font-semibold text-primary text-xl mb-2">Rs. {item.apolloPrice}</div>
                    </div>
                    <Button asChild size="sm" className="w-full mt-2">
                      <a href={item.apolloLink} target="_blank" rel="noopener noreferrer">
                        Buy Now
                      </a>
                    </Button>
                  </Card>
                  {/* Netmeds Card */}
                  <Card className="flex-1 max-w-xs flex flex-col items-center p-4 shadow-md h-56 justify-between">
                    <div className="flex-grow flex flex-col items-center justify-center w-full">
                      <Image src="/images/netmeds.jpg" alt="Netmeds logo" width={100} height={40} className="object-contain mb-2" />
                      <div className="font-semibold text-primary text-xl mb-2">Rs. {item.netmedsPrice}</div>
                    </div>
                    <Button asChild size="sm" className="w-full mt-2">
                      <a href={item.netmedsLink} target="_blank" rel="noopener noreferrer">
                        Buy Now
                      </a>
                    </Button>
                  </Card>
                  {/* 1mg Card */}
                  <Card className="flex-1 max-w-xs flex flex-col items-center p-4 shadow-md h-56 justify-between">
                    <div className="flex-grow flex flex-col items-center justify-center w-full">
                      <Image src="/images/1mg.png" alt="1mg logo" width={100} height={40} className="object-contain mb-2" />
                      <div className="font-semibold text-primary text-xl mb-2">Rs. {item.pharmeasyPrice}</div>
                    </div>
                    <Button asChild size="sm" className="w-full mt-2">
                      <a href={item.pharmeasyLink} target="_blank" rel="noopener noreferrer">
                        Buy Now
                      </a>
                    </Button>
                  </Card>
                  
                </div>
              </div>
            ))
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