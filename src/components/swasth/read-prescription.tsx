"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, ScanLine, X, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { extractPrescriptionText } from '@/ai/flows/extract-prescription-text';
import Image from 'next/image';

export default function ReadPrescription() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError(null);
      } else {
        setError('Invalid file type. Please upload an image.');
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file (e.g., JPG, PNG).',
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setError(null);
    setExtractedText(null);

    try {
      const result = await extractPrescriptionText({ imageDataUri: previewUrl });
      setExtractedText(result.extractedText);
    } catch (e) {
      setError('An error occurred while analyzing the prescription. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const renderContent = () => {
    if (previewUrl) {
      return (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Image src={previewUrl} alt="Uploaded prescription" width={800} height={600} className="rounded-md object-contain max-h-[400px]" />
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button onClick={reset} variant="outline" className="w-full">
              <X className="mr-2" /> Clear
            </Button>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><ScanLine className="mr-2" /> Analyze Prescription</>
              )}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div 
          className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-center text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, or GIF</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
        <Card>
            <CardHeader>
                <CardTitle>Read Prescription</CardTitle>
                <CardDescription>Upload a picture of your prescription. The AI will extract the text for you.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>

        {error && !isLoading && (
            <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {extractedText && (
            <Card className="animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                Extracted Text
                </CardTitle>
                <CardDescription>
                Here is the text extracted from your prescription. Please review it for accuracy.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap rounded-md bg-secondary/50 p-4 font-sans text-sm">{extractedText}</pre>
            </CardContent>
            </Card>
        )}
    </div>
  )
}
