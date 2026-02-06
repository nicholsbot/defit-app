
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ShieldCheck } from "lucide-react";

interface WeeklyCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyCompletionDialog({
  isOpen,
  onClose,
}: WeeklyCompletionDialogProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-full max-w-md text-center p-8 bg-card border-accent shadow-lg">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 animate-in zoom-in-50 duration-500">
          <ShieldCheck className="h-16 w-16 text-primary animate-pulse" />
        </div>
        <AlertDialogHeader className="mt-4">
          <AlertDialogTitle className="text-3xl font-bold text-foreground">
            Weekly Mission Complete!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-muted-foreground mt-4 italic">
            &quot;You&apos;ve met the standard. Now, exceed it. Your discipline this week is a testament to your commitment. Stay focused, stay ready.&quot;
          </AlertDialogDescription>
          <div className="text-right not-italic font-semibold text-primary mt-2">- CSM Betty</div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
