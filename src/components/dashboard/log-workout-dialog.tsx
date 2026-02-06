
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { WorkoutData } from "@/lib/types";
import { CARDIO_GOALS, CATEGORIES } from "@/lib/constants";
import { useEffect, useMemo } from "react";

const formSchema = z.object({
  tmar: z.coerce.number().min(0, "Must be positive").optional(),
  strength: z.coerce.number().min(0, "Must be positive").optional(),
  hiit: z.coerce.number().min(0, "Must be positive").optional(),
  cardio: z.object({
    runRuckWalk: z.coerce.number().min(0, "Must be positive").optional(),
    ellipticalRow: z.coerce.number().min(0, "Must be positive").optional(),
    swim: z.coerce.number().min(0, "Must be positive").optional(),
    cycle: z.coerce.number().min(0, "Must be positive").optional(),
  }),
});

interface LogWorkoutDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogWorkout: (data: WorkoutData) => void;
  initialData: WorkoutData;
  initialTab?: keyof typeof CATEGORIES;
}

export default function LogWorkoutDialog({
  isOpen,
  setIsOpen,
  onLogWorkout,
  initialData,
  initialTab = 'tmar',
}: LogWorkoutDialogProps) {
  
  const defaultValues = useMemo(() => ({
      tmar: initialData.tmar || undefined,
      strength: initialData.strength || undefined,
      hiit: initialData.hiit || undefined,
      cardio: {
        runRuckWalk: initialData.cardio.runRuckWalk || undefined,
        ellipticalRow: initialData.cardio.ellipticalRow || undefined,
        swim: initialData.cardio.swim || undefined,
        cycle: initialData.cardio.cycle || undefined,
      },
  }), [initialData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const workoutData: WorkoutData = {
        tmar: values.tmar || 0,
        strength: values.strength || 0,
        hiit: values.hiit || 0,
        cardio: {
            runRuckWalk: values.cardio.runRuckWalk || 0,
            ellipticalRow: values.cardio.ellipticalRow || 0,
            swim: values.cardio.swim || 0,
            cycle: values.cardio.cycle || 0,
        },
    };
    onLogWorkout(workoutData);
    setIsOpen(false);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Log a Workout</DialogTitle>
          <DialogDescription>
            Enter the values for a workout session. These will be added to your weekly total.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tmar">TMAR-M</TabsTrigger>
                <TabsTrigger value="strength">Strength</TabsTrigger>
                <TabsTrigger value="cardio">Cardio</TabsTrigger>
                <TabsTrigger value="hiit">HIIT</TabsTrigger>
              </TabsList>
              <div className="py-4">
                <TabsContent value="tmar">
                  <FormField
                    control={form.control}
                    name="tmar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 20" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="strength">
                  <FormField
                    control={form.control}
                    name="strength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Lbs Lifted</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 2500" {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="cardio">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardio.runRuckWalk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`${CARDIO_GOALS.RUN_RUCK_WALK.label} (${CARDIO_GOALS.RUN_RUCK_WALK.unit})`}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder={`e.g. 3`} {...field} value={field.value ?? ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardio.ellipticalRow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{`${CARDIO_GOALS.ELLIPTICAL_ROW.label} (${CARDIO_GOALS.ELLIPTICAL_ROW.unit})`}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder={`e.g. 5`} {...field} value={field.value ?? ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardio.swim"
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>{`${CARDIO_GOALS.SWIM.label} (${CARDIO_GOALS.SWIM.unit})`}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder={`e.g. 1000`} {...field} value={field.value ?? ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardio.cycle"
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>{`${CARDIO_GOALS.CYCLE.label} (${CARDIO_GOALS.CYCLE.unit})`}</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder={`e.g. 10`} {...field} value={field.value ?? ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="hiit">
                  <FormField
                    control={form.control}
                    name="hiit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Minutes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 15" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Log Workout</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    