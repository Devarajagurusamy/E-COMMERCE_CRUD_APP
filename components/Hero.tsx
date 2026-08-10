import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  ];

  return (
    <section className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] flex items-center px-6 sm:px-12 lg:px-24 py-12 sm:py-16 overflow-hidden bg-[#f4f4f6]">
      {/* Hero Background Image - Uncropped & Right Aligned */}
      <img
        src="/hero-bg.png"
        alt="Hero background"
        className="absolute right-0 top-0 bottom-0 h-full w-auto max-w-full lg:max-w-none object-contain object-right z-0 pointer-events-none opacity-40 sm:opacity-100"
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl text-left space-y-6">
        {/* Category Tag */}
        <p className="text-zinc-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
          TRENDING NOW
        </p>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-black tracking-tight leading-[1.1]">
          Discover Products<br />You’ll Love
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-700 font-medium leading-relaxed max-w-md">
          Shop the latest trending products curated for modern lifestyles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/products">
            <Button
              className="
                bg-black
                hover:bg-zinc-800
                text-white
                font-semibold
                px-6
                py-3.5
                h-auto
                rounded-lg
                shadow-md
                transition-all
                duration-200
                flex
                items-center
                gap-2
                text-sm
                sm:text-base
              "
            >
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </Link>

          <Link href="/products">
            <Button
              variant="outline"
              className="
                bg-white
                hover:bg-zinc-100
                text-black
                border
                border-zinc-300
                font-semibold
                px-6
                py-3.5
                h-auto
                rounded-lg
                shadow-sm
                transition-all
                duration-200
                text-sm
                sm:text-base
              "
            >
              Explore Collection
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3 pt-6 sm:pt-8">
          <div className="flex -space-x-2.5 overflow-hidden">
            {avatars.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Customer ${idx + 1}`}
                className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-white object-cover shadow-sm"
              />
            ))}
          </div>

          <span className="text-xs sm:text-sm text-black/80 font-medium">
            Loved by 10,000+ customers worldwide
          </span>
        </div>
      </div>
    </section>
  );
}
