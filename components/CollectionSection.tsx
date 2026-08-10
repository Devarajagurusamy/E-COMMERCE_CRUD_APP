"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Zap } from "lucide-react";

export default function CollectionSection() {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* Card 1: Flash Sale */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-red-500 to-rose-600 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] shadow-lg group">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10 space-y-4 max-w-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md tracking-wider uppercase">
              <Zap className="h-3.5 w-3.5 fill-current" />
              Flash Sale
            </span>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Up To 70% Off
            </h3>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { label: "Days", val: timeLeft.days },
                { label: "Hours", val: timeLeft.hours },
                { label: "Mins", val: timeLeft.minutes },
                { label: "Secs", val: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 min-w-[48px] text-center border border-white/10">
                    <span className="block text-lg font-black tracking-tight leading-none">
                      {formatNumber(item.val)}
                    </span>
                    <span className="text-[10px] text-white/70 font-semibold uppercase mt-0.5 block">
                      {item.label}
                    </span>
                  </div>
                  {idx < 3 && <span className="font-bold text-lg text-white/80">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 pt-6">
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-stone-100 font-bold px-6 py-3 rounded-xl shadow-md transition-transform group-hover:scale-105">
                <span>Shop Sale Now</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right Product Image */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none flex items-center justify-end">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
              alt="Flash Sale Shoe"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 lg:opacity-100"
            />
          </div>
        </div>

        {/* Card 2: Summer Collection */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] shadow-lg border border-zinc-800 group">
          {/* Background Ambient Glow */}
          <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10 space-y-4 max-w-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 tracking-wider uppercase border border-zinc-700">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              New Collection
            </span>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Summer 2025
            </h3>

            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              Discover the latest trends and fresh styles curated for high performance & style.
            </p>
          </div>

          {/* Action Button */}
          <div className="relative z-10 pt-6">
            <Link href="/products">
              <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-3 rounded-xl shadow-md transition-transform group-hover:scale-105">
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right Fitness Model Image */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
              alt="Summer Collection Model"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>
        </div>

      </div>
    </section>
  );
}
