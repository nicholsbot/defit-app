
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { isDemoMode, logDemoMessage } from "@/firebase/demo-mode";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const heroImage = placeholderImages.find((p) => p.id === "hero");
  
  let auth = null;
  try {
    auth = useAuth();
  } catch (error) {
    // Auth not available in demo mode
    console.log('Auth not available - running in demo mode');
  }
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isDemoMode() || !auth) {
        logDemoMessage('Demo login - redirecting to dashboard');
        toast({
          title: "Demo Login Successful",
          description: "Welcome to the DEFIT demo!",
        });
        router.push("/dashboard");
        return;
      }
      
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
      });
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="z-10 flex flex-col items-center w-full max-w-md">
        <Link href="/">
          <Image
            src="/fonts/Images/defit logo 1.png"
            alt="DEFIT Challenge Logo"
            width={300}
            height={150}
            className="mb-6 w-auto h-auto"
          />
        </Link>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="e.g., jane.doe@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-bold">
                  Login
                </Button>
              </form>
            </Form>
            <p className="mt-4 text-center text-sm">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-primary hover:underline">
                Forgot your password?
              </Link>
            </p>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Register Now
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
