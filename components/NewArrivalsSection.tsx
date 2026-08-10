"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NewArrivalsSection() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Fallback sample products if API returns empty array initially
  const sampleProducts = [
    {
      _id: "sample-1",
      title: "Essential Hoodie",
      description: "Premium heavy cotton oversized relaxed fit hoodie",
      price: 59.99,
      discount: 0,
      clothType: "Hoodies",
      brand: "EComm Essentials",
      size: "M",
      color: "Beige",
      stock: 25,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    },
    {
      _id: "sample-2",
      title: "Air Max 270 Modern",
      description: "Breathable mesh lightweight performance sneakers",
      price: 129.99,
      discount: 20,
      clothType: "Footwear",
      brand: "Nike",
      size: "42",
      color: "White",
      stock: 18,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
    },
    {
      _id: "sample-3",
      title: "Minimalist Studio Jacket",
      description: "Tailored minimalist zip jacket crafted for comfort",
      price: 89.99,
      discount: 10,
      clothType: "Outerwear",
      brand: "Studio Minimal",
      size: "L",
      color: "Black",
      stock: 14,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80",
    },
    {
      _id: "sample-4",
      title: "Athletic Performance Tank",
      description: "Seamless moisture wicking high impact workout top",
      price: 34.99,
      discount: 0,
      clothType: "Activewear",
      brand: "AeroFit",
      size: "S",
      color: "Charcoal",
      stock: 30,
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const displayProducts = products.length > 0 ? products.slice(0, 4) : sampleProducts;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            New Arrivals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked fresh styles just landed in our catalog
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors group"
        >
          <span>View All New Arrivals</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      ) : (
        <ProductGrid products={displayProducts} />
      )}
    </section>
  );
}
