"use client";

import { useState } from "react";
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
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { useAuth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { isDemoMode, logDemoMessage } from "@/firebase/demo-mode";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const heroImage = placeholderImages.find((p) => p.id === "hero");
  const { toast } = useToast();

  let auth = null;
  try {
    auth = useAuth();
  } catch (error) {
    console.log("Auth not available - running in demo mode");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isDemoMode() || !auth) {
        logDemoMessage("Demo password reset requested for " + values.email);
        toast({
          title: "Demo Mode",
          description: "Password reset is not available in demo mode.",
        });
        setSubmitted(true);
        return;
      }

      await sendPasswordResetEmail(auth, values.email);
      setSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Don't reveal whether the email exists
      setSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description:
          "If an account exists with that email, you'll receive reset instructions.",
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
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              {submitted
                ? "Check your email for a password reset link."
                : "Enter your email address and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                  <Button type="submit" className="w-full font-bold">
                    Send Reset Link
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  If an account exists with that email, you&apos;ll receive a
                  password reset link shortly.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSubmitted(false)}
                >
                  Try Another Email
                </Button>
              </div>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
