
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Logo = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-4"
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      fill="hsl(var(--primary))"
      fillOpacity="0.1"
    />
    <path
      d="M15 10h-2V8a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z"
      fill="hsl(var(--destructive))"
    />
  </svg>
);


export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center p-8 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-4xl font-bold font-headline text-primary">
            Welcome to SWASTH
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Your friendly AI health assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
           <Button asChild variant="link" className="w-full">
              <Link href="/home?guest=true">Continue as Guest &rarr;</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
