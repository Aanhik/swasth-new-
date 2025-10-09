"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Camera, ScanLine, X, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { extractPrescriptionText } from '@/ai/flows/extract-prescription-text';
import Image from 'next/image';

export default function ReadPrescription() {
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this device.");
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setError('Camera access denied. Please enable camera permissions in your browser settings.');
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError(null);
    setExtractedText(null);

    try {
      const result = await extractPrescriptionText({ imageDataUri: capturedImage });
      setExtractedText(result.extractedText);
    } catch (e) {
      setError('An error occurred while analyzing the prescription. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setExtractedText(null);
    setError(null);
  };
  
  const renderContent = () => {
    if (hasCameraPermission === null) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Requesting camera access...</p>
            </div>
        );
    }
    
    if (hasCameraPermission === false) {
        return (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                {error || "Please allow camera access to use this feature."}
              </AlertDescription>
            </Alert>
        );
    }

    if (capturedImage) {
      return (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <Image src={capturedImage} alt="Captured prescription" width={800} height={600} className="rounded-md" />
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Button onClick={reset} variant="outline" className="w-full">
              <X className="mr-2" /> Retake
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
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
          <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-3/4 w-3/4 rounded-lg border-4 border-dashed border-white/50" />
          </div>
        </div>
        <Button onClick={takePicture} className="w-full">
          <Camera className="mr-2" /> Capture Prescription
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
        <Card>
            <CardHeader>
                <CardTitle>Read Prescription</CardTitle>
                <CardDescription>Use your camera to scan your prescription. The AI will extract the text for you.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
                <canvas ref={canvasRef} className="hidden" />
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
