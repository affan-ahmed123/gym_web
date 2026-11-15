import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-steel-100 flex flex-col items-center justify-center px-6 text-center">
      <p className="font-condensed text-xs uppercase tracking-[0.25em] text-steel-400 mb-3">
        404 · Page Not Found
      </p>
      <h1 className="font-display text-6xl sm:text-7xl text-white mb-4">
        OFF TRACK.
      </h1>
      <p className="text-sm text-steel-400 max-w-md mb-7">
        This page could not be found. Head back to Ahsan Hussain Fitness to
        explore coaching programs and book a free session.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg bg-steel-100 hover:bg-white text-obsidian-950 font-condensed font-bold text-sm uppercase tracking-wider transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

