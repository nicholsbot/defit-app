
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserAvatarWithRank } from '@/components/user/user-avatar-with-rank';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useWorkoutLog } from '@/hooks/use-workout-log';
import {
  TMAR_M_GOAL_MINS,
  STRENGTH_GOAL_LBS,
  HIIT_GOAL_MINS,
  CARDIO_GOALS,
} from "@/lib/constants";
import type { UserProfile, WorkoutLog } from '@/lib/types';
import { isDemoMode, logDemoMessage } from '@/firebase/demo-mode';


export default function ProfilePage() {
  const { user } = useUser();
  
  let firestore = null;
  try {
    firestore = useFirestore();
  } catch (error) {
    // Firestore not available in demo mode
    console.log('Firestore not available - running in demo mode');
  }
  
  const { toast } = useToast();
  const { workoutLogs, userProfile } = useWorkoutLog();


  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Compress image to fit within Firestore's 1MB doc limit
  // Returns a base64 data URL, targeting ~100KB max
  const compressImage = (file: File, maxWidth = 256, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
      img.src = url;
    });
  };

  useEffect(() => {
    if (userProfile) {
        setDisplayName(userProfile.displayName || '');
        setAvatarUrl(userProfile.avatarUrl || null);
    }
  }, [userProfile]);

  const overallProgressPercentage = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) return 0;
    
    const weeklyTotals: { [week: number]: { tmar: number; strength: number; hiit: number; cardio: number } } = {};

    workoutLogs.forEach(log => {
      if (!weeklyTotals[log.week]) {
        weeklyTotals[log.week] = { tmar: 0, strength: 0, hiit: 0, cardio: 0 };
      }
      weeklyTotals[log.week].tmar += log.tmarMMinutes;
      weeklyTotals[log.week].strength += log.resistanceLbs;
      weeklyTotals[log.week].hiit += log.hiitMinutes;

      const cardioProgress =
        (log.cardioMilesRunning / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesRucking / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesWalking / CARDIO_GOALS.RUN_RUCK_WALK.goal) +
        (log.cardioMilesElliptical / CARDIO_GOALS.ELLIPTICAL_ROW.goal) +
        (log.cardioMilesRowing / CARDIO_GOALS.ELLIPTICAL_ROW.goal) +
        (log.cardioMetersSwimming / CARDIO_GOALS.SWIM.goal) +
        (log.cardioMilesCycling / CARDIO_GOALS.CYCLE.goal);
      
      weeklyTotals[log.week].cardio += cardioProgress * 100;
    });

    const numWeeks = Object.keys(weeklyTotals).length;
    if (numWeeks === 0) return 0;

    let totalTmarPercentage = 0;
    let totalStrengthPercentage = 0;
    let totalHiitPercentage = 0;
    let totalCardioPercentage = 0;

    Object.values(weeklyTotals).forEach(week => {
        totalTmarPercentage += (week.tmar / TMAR_M_GOAL_MINS) * 100;
        totalStrengthPercentage += (week.strength / STRENGTH_GOAL_LBS) * 100;
        totalHiitPercentage += (week.hiit / HIIT_GOAL_MINS) * 100;
        totalCardioPercentage += week.cardio;
    });
    
    const avgTmar = totalTmarPercentage / numWeeks;
    const avgStrength = totalStrengthPercentage / numWeeks;
    const avgHiit = totalHiitPercentage / numWeeks;
    const avgCardio = totalCardioPercentage / numWeeks;

    return (avgTmar + avgStrength + avgHiit + avgCardio) / 4;
  }, [workoutLogs]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }
      setNewAvatarFile(file);
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    if (isDemoMode() || !firestore) {
      logDemoMessage('Saving profile in demo mode (not persisted)');
      toast({
        title: "Demo Profile Updated",
        description: "Profile updated in demo mode (changes not saved).",
      });
      return;
    }
    
    const userDocRef = doc(firestore, 'users', user.uid);
    setIsLoading(true);

    let newAvatarDataUrl: string | null = null;
    if (newAvatarFile) {
      try {
        // Compress to ~256px wide JPEG to stay well under Firestore's 1MB doc limit
        newAvatarDataUrl = await compressImage(newAvatarFile, 256, 0.6);
        const sizeKB = Math.round((newAvatarDataUrl.length * 3) / 4 / 1024);
        if (sizeKB > 500) {
          toast({
            variant: "destructive",
            title: "Image Too Large",
            description: `Compressed image is ~${sizeKB}KB. Please use a smaller photo. (Max ~500KB after compression)`,
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error('Image compression failed:', err);
        toast({
          variant: "destructive",
          title: "Image Error",
          description: "Could not process the image. Please try a different file.",
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const profileData: Partial<UserProfile> = {
        displayName: displayName,
      };
      if (newAvatarDataUrl) {
        // TODO: Migrate to Firebase Storage for proper file handling
        profileData.avatarUrl = newAvatarDataUrl;
      }

      await setDoc(userDocRef, profileData, { merge: true });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not save your profile.",
      });
    } finally {
      setIsLoading(false);
      if (newAvatarFile && avatarUrl && avatarUrl.startsWith('blob:')) {
         URL.revokeObjectURL(avatarUrl);
      }
      setNewAvatarFile(null);
    }
  };

  const currentAvatarSrc = avatarUrl || user?.photoURL;
  const fallback = displayName?.charAt(0) || user?.email?.charAt(0) || 'U';

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customize Profile</CardTitle>
          <CardDescription>
            Personalize your account details and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
                <UserAvatarWithRank
                    src={currentAvatarSrc || undefined}
                    fallback={fallback}
                    overallProgress={overallProgressPercentage}
                    className="h-32 w-32 border-4 border-primary text-4xl"
                />
                <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary">
                    <Upload className="h-8 w-8" />
                    <span className="font-semibold">Click to upload a photo</span>
                    <span className="text-xs">(PNG, JPG up to 5MB)</span>
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleFileChange} />
            </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    