"use client";

import { ReactNode } from "react";

export function HeroCard({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  rightSlot?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl card-blur p-6 sm:p-10">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-violet-400/50 via-cyan-300/40 to-sky-400/40" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-bl from-fuchsia-400/40 via-rose-300/30 to-amber-200/30" />

      <div className="flex items-start justify-between gap-6 relative">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold gradient-text">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm sm:text-base text-black/70 dark:text-white/70 max-w-xl">{subtitle}</p>
          ) : null}
        </div>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
