
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { useWorkoutLog } from "@/hooks/use-workout-log";
import { CARDIO_GOALS } from "@/lib/constants";
import type { CardioData, ParticipantCategory, DutyStatus } from "@/lib/types";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { isDemoMode, logDemoMessage } from "@/firebase/demo-mode";

const cardioOptions = Object.keys(CARDIO_GOALS).map(key => ({
  id: key as keyof CardioData,
  label: CARDIO_GOALS[key as keyof CardioData].label
}));

const participantCategories: { value: ParticipantCategory; label: string; description: string }[] = [
  { value: 'soldier', label: 'Soldier', description: 'U.S. Army Reserve Soldier eligible for official awards' },
  { value: 'civilian', label: 'Civilian', description: 'DoD civilian or contractor' },
  { value: 'family', label: 'Family Member', description: 'Military family member participating for fitness' },
];

const dutyStatusOptions: { value: DutyStatus; label: string; description: string }[] = [
  { value: 'TPU', label: 'TPU', description: 'Troop Program Unit (Traditional Drilling Reservist)' },
  { value: 'IMA', label: 'IMA', description: 'Individual Mobilization Augmentee' },
  { value: 'AGR', label: 'AGR', description: 'Active Guard Reserve' },
  { value: 'T10', label: 'T10', description: 'Title 10 (Federal Active Duty)' },
];

const formSchema = z.object({
  participantCategory: z.enum(['soldier', 'civilian', 'family'], {
    required_error: "Please select a participant category",
  }),
  dutyStatus: z.enum(['IMA', 'TPU', 'AGR', 'T10']).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  rank: z.string().optional(),
  unit: z.string().optional(),
  teamName: z.string().optional(),
  availableCardio: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
}).superRefine((data, ctx) => {
    if (data.participantCategory === 'soldier') {
        if (!data.dutyStatus) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Duty status is required for Soldiers",
                path: ["dutyStatus"],
            });
        }
        if (!data.rank || data.rank.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Rank is required for Soldiers",
                path: ["rank"],
            });
        }
        if (!data.unit || data.unit.length < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Unit is required for Soldiers",
                path: ["unit"],
            });
        }
    }
});

export default function RegisterPage() {
  const router = useRouter();
  const heroImage = placeholderImages.find((p) => p.id === "hero");
  const { setAvailableCardio } = useWorkoutLog();
  
  let auth = null;
  let firestore = null;
  
  try {
    auth = useAuth();
    firestore = useFirestore();
  } catch (error) {
    // Firebase services not available in demo mode
    console.log('Firebase services not available - running in demo mode');
  }
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantCategory: undefined,
      dutyStatus: undefined,
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      rank: "",
      unit: "",
      teamName: "",
      availableCardio: cardioOptions.map(c => c.id),
    },
  });

  const participantCategory = form.watch("participantCategory");
  const isSoldier = participantCategory === 'soldier';

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isDemoMode() || !auth || !firestore) {
        logDemoMessage('Demo registration - redirecting to dashboard');
        
        setAvailableCardio(values.availableCardio as (keyof CardioData)[]);
        
        toast({
          title: "Demo Registration Successful",
          description: "Welcome to the DEFIT demo!",
        });
        
        router.push("/dashboard");
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        const userProfile = {
          id: user.uid,
          displayName: values.name,
          email: values.email,
          registrationDate: new Date().toISOString(),
          participantCategory: values.participantCategory,
          dutyStatus: values.participantCategory === 'soldier' ? values.dutyStatus : null,
          isSoldier: values.participantCategory === 'soldier', // For backwards compatibility
          rank: values.rank,
          unit: values.unit,
          teamName: values.teamName,
          phoneNumber: values.phoneNumber,
          availableCardio: values.availableCardio,
        };
        
        const userDocRef = doc(firestore, "users", user.uid);
        setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
        
        setAvailableCardio(values.availableCardio as (keyof CardioData)[]);
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });
        
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 py-8">
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
      <div className="z-10 flex flex-col items-center w-full max-w-2xl">
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
            <CardTitle>Create Your DEFIT Account</CardTitle>
            <CardDescription>
                Join the challenge and start tracking your progress.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="participantCategory"
                    render={({ field }) => (
                    <FormItem className="rounded-md border p-4">
                        <FormLabel className="text-base">Participant Category</FormLabel>
                        <FormDescription>
                            Select your category. Soldiers are eligible for official awards.
                        </FormDescription>
                        <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                        >
                            {participantCategories.map((category) => (
                            <FormItem key={category.value}>
                                <FormControl>
                                <div className="flex items-start space-x-3 space-y-0">
                                    <RadioGroupItem value={category.value} id={category.value} />
                                    <div className="space-y-1 leading-none">
                                    <FormLabel htmlFor={category.value} className="font-medium cursor-pointer">
                                        {category.label}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                        {category.description}
                                    </FormDescription>
                                    </div>
                                </div>
                                </FormControl>
                            </FormItem>
                            ))}
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {isSoldier && (
                <FormField
                    control={form.control}
                    name="dutyStatus"
                    render={({ field }) => (
                    <FormItem className="rounded-md border p-4">
                        <FormLabel className="text-base">Duty Status</FormLabel>
                        <FormDescription>
                            Select your Army Reserve duty status.
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select duty status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {dutyStatusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                <span className="font-medium">{status.label}</span>
                                <span className="text-muted-foreground ml-2">— {status.description}</span>
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Jane Doe" {...field} />
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
                            <Input placeholder="e.g., jane.doe@example.com" {...field} />
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
                            <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="e.g., (555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem className={!isSoldier ? 'md:col-span-2' : ''}>
                        <FormLabel>Team Name (Optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., The High-Speed Eagles" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {isSoldier && (
                    <>
                        <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Rank</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., SGT" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 351st CACOM" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </>
                    )}
                </div>
                 <FormField
                    control={form.control}
                    name="availableCardio"
                    render={() => (
                        <FormItem className="rounded-md border p-4">
                        <div className="mb-4">
                            <FormLabel className="text-base">Available Cardio Equipment</FormLabel>
                            <FormDescription>
                                Select all the cardio options you have access to. This will help tailor your workout plan.
                            </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {cardioOptions.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="availableCardio"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== item.id
                                                )
                                                )
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                    </FormItem>
                                )
                                }}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full font-bold">
                    Create Account
                </Button>
                </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                Login
                </Link>
            </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
