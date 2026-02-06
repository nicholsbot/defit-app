
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero");

  return (
    <main className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 p-4 flex flex-col items-center">
        <Image
            src="/fonts/Images/defit logo 1.png"
            alt="DEFIT Challenge Logo"
            width={400}
            height={200}
            priority
            className="w-auto h-auto max-w-[400px]"
        />
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200 font-body">
          The annual fitness challenge for Soldiers. Track your progress, compete on leaderboards, and push your limits.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="font-bold text-base bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/register">Register Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
