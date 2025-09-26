"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/checkin", label: "Check-in" },
  { href: "/goals", label: "Goals" },
  { href: "/progress", label: "Progress" },
  { href: "/feedback", label: "Feedback" },
];

export function HeaderNav() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-40 px-6 sm:px-10 pt-4">
      <div className="card-blur rounded-full px-3 py-2 w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          <Link href="/dashboard/checkin" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
            <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-tr from-violet-400 via-cyan-300 to-sky-400" />
            <span className="text-sm font-semibold tracking-wide">Life Tracker</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "text-sm px-3 py-1.5 rounded-full transition " +
                    (active
                      ? "bg-black/10 dark:bg-white/20"
                      : "hover:bg-black/5 dark:hover:bg-white/10")
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
