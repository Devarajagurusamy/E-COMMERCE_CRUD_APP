"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  itemCount: string;
  image: string;
  href: string;
}

export default function CategorySection() {
  const categories: Category[] = [
    {
      id: "fashion",
      name: "Fashion",
      itemCount: "120+ Items",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Fashion",
    },
    {
      id: "hoodies",
      name: "Hoodies",
      itemCount: "85+ Items",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Hoodies",
    },
    {
      id: "activewear",
      name: "Activewear",
      itemCount: "95+ Items",
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Activewear",
    },
    {
      id: "footwear",
      name: "Footwear",
      itemCount: "110+ Items",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Footwear",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      itemCount: "64+ Items",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Minimalist",
    },
    {
      id: "accessories",
      name: "Accessories",
      itemCount: "140+ Items",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
      href: "/products?clothType=Accessories",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Shop by Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Explore our curated collections designed for modern lifestyles
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badges & Content inside image bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-bold text-base leading-tight tracking-tight">
                  {cat.name}
                </h3>
                <span className="text-xs text-white/80 font-medium mt-0.5 inline-block">
                  Shop Now →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
