
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { Award, Calendar, Users, Star, Dumbbell, HeartPulse, Sparkles, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RulesPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>DEFIT 2026: Challenge Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-invert max-w-none text-muted-foreground">
            <p className="text-lg">
              Welcome to the 2026 Double Eagle Fitness (DEFIT) Challenge! This is more
              than a competition; it's a ten-week journey to forge a stronger you.
              Built on the Army's Holistic Health and Fitness (H2F) principles, DEFIT
              is designed to push your physical limits, build community, and reinforce the warrior spirit.
              Let's get after it!
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>Challenge Timeline & Integrity</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                <p>
                  The challenge kicks off on <strong>January 12, 2026</strong>, and concludes on <strong>March 22, 2026</strong>.
                </p>
                <p>
                  This challenge is built on honor. You are responsible for accurately logging your workouts. While the data you enter is based on your integrity, we highly encourage you to keep personal records. This ensures fairness and helps with any verification if needed. Your commitment to honesty is your bond.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">
                 <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <span>Participation & Eligibility</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                <h4>Everyone is Welcome!</h4>
                <p>
                  Civilians, family members, and friends are highly encouraged to join the challenge, track their progress, and be part of our fitness community. Let's get fit together!
                </p>
                <h4>Eligibility for Awards</h4>
                <p>
                  While everyone can participate, official awards, medallions, and certificates are reserved for United States Army Reserve Soldiers. We celebrate everyone's effort, but official accolades are designated for those in uniform.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">
                 <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <span>Individual & Team Competition</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                <p>
                  You can compete as an individual, as part of a team (4-9 members), or with your unit. The leaderboards will rank individuals, teams, and units, so every rep counts!
                </p>
                <p>
                  <strong>Important Note:</strong> Even if you join a team, your score still counts toward the individual leaderboards. Compete with your crew while chasing personal glory!
                </p>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="categories">
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span>Workout Categories & Scoring</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <HeartPulse className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">Cardiovascular</CardTitle>
                    </div>
                     <CardDescription>Combine activities to meet your weekly 100% goal.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">You can mix and match activities to meet your goal. The total will turn green once the 100% minimum is met.</p>
                     <List>
                      <ListItem><strong>Run/Walk/Ruck:</strong> 12 miles/week (120 miles total)</ListItem>
                      <ListItem><strong>Bike:</strong> 40 miles/week (400 miles total)</ListItem>
                      <ListItem><strong>Swim:</strong> 3,200 meters/week (32,000 meters total)</ListItem>
                      <ListItem><strong>Elliptical/Rowing:</strong> 15 miles/week (150 miles total)</ListItem>
                    </List>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                     <div className="flex items-center gap-3">
                      <Dumbbell className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">Strength & Resistance</CardTitle>
                    </div>
                     <CardDescription>Total weight lifted, calculated as: Sets × Reps × Weight</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Bodyweight exercises like push-ups or sit-ups do not count. The weekly goal is <strong>5,000 lbs</strong>, for a total of 50,000 lbs over 10 weeks.</p>
                  </CardContent>
                </Card>

                <Card>
                   <CardHeader>
                     <div className="flex items-center gap-3">
                      <Zap className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">HIIT (High-Intensity Interval Training)</CardTitle>
                    </div>
                     <CardDescription>Quick, intense bursts of exercise followed by short recovery periods.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Time spent in HIIT cannot be double-counted in other categories. The weekly goal is <strong>45 minutes</strong>, for a total of 450 minutes over 10 weeks.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <HeartPulse className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">TMAR-M</CardTitle>
                    </div>
                     <CardDescription>Tactical Mobility, Active Recovery, and Mindfulness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Low-intensity exercise (e.g., dynamic stretching, warm-ups, cool-downs, yoga). The weekly goal is <strong>60 minutes</strong>, for a total of 600 minutes over 10 weeks.</p>
                  </CardContent>
                </Card>

              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold">
                 <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-primary" />
                  <span>Earning Achievements</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                <p>
                  Pushing your limits comes with recognition. Here’s how we celebrate achievement:
                </p>
                <List>
                   <ListItem>
                    <strong>Individuals:</strong> Meet all minimum thresholds and earn a Certificate of Completion. Top performers may even get a shot at competing in Washington, D.C. during Army Birthday Week!
                  </ListItem>
                  <ListItem>
                    <strong>Teams:</strong> The top 3 USAR teams will receive a Certificate of Placement, with medallions for the top 4 scoring members of each team.
                  </ListItem>
                  <ListItem>
                    <strong>Units:</strong> The top 3 USAR units in Small, Medium, and Large categories will receive a Certificate of Placement and a medallion.
                  </ListItem>
                </List>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center pt-4">
             <h3 className="font-semibold text-foreground">HAVE QUESTIONS?</h3>
             <p className="text-muted-foreground text-sm">
                Contact the USARC CSM team at <a href="mailto:usar-csm@army.mil" className="text-primary hover:underline">usar-csm@army.mil</a>.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
