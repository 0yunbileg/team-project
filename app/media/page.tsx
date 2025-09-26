"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MediaForm } from "@/components/media/MediaForm";
import { MediaList } from "@/components/media/MediaList";
import { Quotes } from "@/components/media/Quotes";
import { MediaDashboard } from "@/components/media/Dashboard";
import { loadMediaData } from "@/lib/storage";
import type { MediaData } from "@/lib/types";
import { HeroCard } from "@/components/HeroCard";

export default function MediaPage() {
  const [media, setMedia] = useState<MediaData>(loadMediaData());

  useEffect(() => {
    setMedia(loadMediaData());
  }, []);

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10 sm:py-12 text-foreground">
      <HeroCard
        title="Second Brain"
        subtitle="Track books, articles, podcasts, courses, documentaries"
        rightSlot={<ThemeToggle />}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <MediaForm onAdded={() => setMedia(loadMediaData())} />
        </div>
        <div>
          <MediaDashboard data={media} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <MediaList />
        </div>
        <div>
          <Quotes />
        </div>
      </div>
    </div>
  );
}
