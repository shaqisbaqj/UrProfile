import Link from "next/link";

interface ProfileCardProps {
  profile: {
    slug: string;
    name: string;
    headline: string;
    role: string;
    company: string;
    location: string;
    video_playback_id: string;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/profile/${profile.slug}`}
      className="group block bg-dark text-cream overflow-hidden transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail placeholder — cinematic 9:16 crop */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-dark to-[#2a2520] overflow-hidden">
        {/* Mux thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://image.mux.com/${profile.video_playback_id}/thumbnail.jpg?time=2&width=600`}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-ember/90 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-cream ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark/90 to-transparent" />

        {/* Location badge */}
        <div className="absolute top-4 right-4 bg-dark/60 backdrop-blur-sm text-cream/70 text-xs font-body tracking-widest uppercase px-3 py-1.5">
          {profile.location}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6">
        <p className="font-body text-xs tracking-widest uppercase text-ember mb-2">
          {profile.role} &middot; {profile.company}
        </p>
        <h3 className="font-display text-2xl font-medium text-cream mb-2 leading-tight">
          {profile.name}
        </h3>
        <p className="font-body text-sm text-linen/50 leading-relaxed line-clamp-2">
          {profile.headline}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs font-body tracking-widest uppercase text-ember/70 group-hover:text-ember transition-colors duration-200">
          View profile
          <svg
            className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
