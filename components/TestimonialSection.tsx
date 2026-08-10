"use client";

import { Star, CheckCircle2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

export default function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "Sophia Martinez",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      comment: "The quality of the clothing is absolutely top-notch! The fit is true to size and delivery was super fast.",
      rating: 5,
    },
    {
      id: "t2",
      name: "Marcus Vance",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      comment: "Best shopping experience I've had online. The minimalist design and material durability exceed expectations.",
      rating: 5,
    },
    {
      id: "t3",
      name: "Elena Rostova",
      role: "Fashion Blogger",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      comment: "Obsessed with the new summer collection! Super comfortable fabrics and clean aesthetics.",
      rating: 5,
    },
    {
      id: "t4",
      name: "David Chen",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      comment: "The customer service and hassle-free returns made me a loyal customer for life. Highly recommended!",
      rating: 5,
    },
    {
      id: "t5",
      name: "Olivia Taylor",
      role: "Verified Buyer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
      comment: "Elevated staple pieces that fit seamlessly into any wardrobe. Absolutely love every order!",
      rating: 5,
    },
  ];

  // Duplicate list to create a seamless infinite marquee loop
  const loopList = [...testimonials, ...testimonials];

  return (
    <section id="reviews" className="py-16 overflow-hidden bg-muted/40 border-y border-border scroll-mt-20">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground block mb-2">
          Customer Reviews
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Loved by 10,000+ Customers Worldwide
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
          Read real experiences from verified buyers who love our clothing collection.
        </p>
      </div>

      {/* Endless Marquee Loop Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Fade Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-6 px-4">
          {loopList.map((t, idx) => (
            <div
              key={`${t.id}-${idx}`}
              className="w-[300px] sm:w-[360px] shrink-0 bg-card border border-border rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-foreground/90 font-normal leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-6 border-t border-border mt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 leading-tight">
                    <span>{t.name}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/20" />
                  </h4>
                  <span className="text-xs text-muted-foreground font-medium">
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
