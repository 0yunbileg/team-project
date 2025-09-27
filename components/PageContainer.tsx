"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { HeroCard } from "./HeroCard";

// Map routes to page titles
const getPageTitle = (pathname: string) => {
  const routeMap: Record<string, { title: string; subtitle?: string }> = {
    "/dashboard/productivity": { title: "Productivity" },
    "/dashboard/focus": { title: "Focus" },
    "/dashboard/pet": { title: "Pet" },
    "/dashboard/profile": { title: "Profile" },
    "/dashboard": { title: "Dashboard" },
  };

  return routeMap[pathname] || { title: "Life Tracker" };
};

export default function PageContainer({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { title, subtitle } = getPageTitle(pathname || "/");

  return (
    <main key={pathname} className="page-enter w-full max-w-5xl mx-auto">
      <HeroCard title={title} subtitle={subtitle}>
        {children}
      </HeroCard>
    </main>
  );
}
