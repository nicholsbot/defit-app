
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Trophy } from "lucide-react";

interface AchievementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
}

export default function AchievementDialog({
  isOpen,
  onClose,
  categoryName,
}: AchievementDialogProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-full max-w-sm text-center p-8 bg-card border-accent shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 animate-in zoom-in-50 duration-500">
          <Trophy className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-foreground">
            Goal Achieved!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Congratulations! You've met your weekly minimum for{" "}
            <strong className="text-primary">{categoryName}</strong>. Keep pushing!
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
