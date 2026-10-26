import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  url?: string;
  title: string;
  customThumbnail?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  title,
  customThumbnail
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) return null;

  // Extract YouTube ID
  const getYouTubeId = (videoUrl: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const thumbnailUrl = customThumbnail || defaultThumbnail;

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 shadow-md border border-slate-200">
      {!isPlaying ? (
        <div 
          onClick={() => setIsPlaying(true)}
          className="group relative w-full h-full cursor-pointer overflow-hidden"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsPlaying(true);
            }
          }}
          aria-label={`Play walkthrough video for ${title}`}
        >
          {/* Lazy loaded thumbnail */}
          <img
            src={thumbnailUrl}
            alt={`${title} Walkthrough Video`}
            loading="lazy"
            decoding="async"
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Soft Sunlit Overlay */}
          <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/15 transition-colors" />

          {/* Central Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <span className="mt-4 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold tracking-wide border border-slate-200 shadow-md">
              Click to Load 4K Video Walkthrough
            </span>
          </div>

          {/* Title tag */}
          <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-white drop-shadow-md">
            {title} – Official Architectural Tour
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={`${title} Architectural Tour`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
};
