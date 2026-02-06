
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/missions", label: "Missions" },
  { href: "/dashboard/leaderboard", label: "Leaderboard" },
  { href: "/dashboard/resources", label: "Resources" },
  { href: "/dashboard/rules", label: "Rules" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-card border-b">
      <nav className="container flex items-center overflow-x-auto">
        <ul className="flex space-x-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-block whitespace-nowrap px-3 py-3 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
