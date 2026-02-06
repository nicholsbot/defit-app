"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("space-y-2 text-muted-foreground", className)}
    {...props}
  />
));
List.displayName = "List";

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
    {children}
  </li>
));
ListItem.displayName = "ListItem";

export { List, ListItem };
