
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

const resources = [
    {
        title: "DEFIT Challenge VIII MOI",
        description: "The official Memorandum of Instruction for the Double Eagle Fitness (DEFIT) Challenge VIII, containing all rules, regulations, and details.",
        href: "/documents/DEFIT_Challenge_VIII_MOI_DRAFT.pdf",
    },
    {
        title: "H2F Castle Prep Package",
        description: "The Castle Forge preparation package for Holistic Health and Fitness (H2F), January 2024 edition.",
        href: "/documents/H2F_Castle_Prep_Package_Castle_Forge_Jan24.pdf",
    },
    {
        title: "ATP 7-22.02",
        description: "Army Techniques Publication for Physical Readiness Training.",
        href: "/documents/ATP_7-22.02.pdf",
    },
    {
        title: "3-10 MTN Unbreakable Warrior Program",
        description: "The program manual for the 3-10 Mountain 'Unbreakable Warrior' fitness program.",
        href: "/documents/3-10_MTN_Unbreakable_Warrior_Program_Manual.pdf",
    },
    {
        title: "FM 7-22",
        description: "Field Manual for Holistic Health and Fitness, covering all domains of soldier wellness and performance.",
        href: "/documents/FM_7-22.pdf",
    },
    {
        title: "Army H2F Website",
        description: "The official U.S. Army resource for the H2F program. Find information on physical readiness, nutrition, sleep, and more.",
        href: "https://h2f.army.mil/",
    },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {resources.map(resource => (
                 <div key={resource.title} className="p-6 border rounded-lg flex flex-col">
                    <h3 className="font-semibold text-xl text-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span>{resource.title}</span>
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow">
                        {resource.description}
                    </p>
                    <Button asChild>
                    <Link href={resource.href} target="_blank">
                        View Resource <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </div>
            ))}
         
           <div className="p-8 text-center border-dashed border-2 rounded-lg flex flex-col justify-center items-center md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold text-muted-foreground">More Resources Coming Soon</h3>
            <p className="text-muted-foreground mt-2">Check back later for training plans, nutritional information, and more.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
