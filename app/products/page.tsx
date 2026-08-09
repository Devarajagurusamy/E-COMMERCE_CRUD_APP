"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import { AppDispatch, RootState } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import EmptyProducts from "@/components/EmptyProducts";
import ProductFilter, { FilterState } from "@/components/ProductFilter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const initialFilterState: FilterState = {
  search: "",
  clothType: "all",
  brand: "all",
  size: "all",
  maxPrice: "",
  inStockOnly: false,
  sortBy: "newest",
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Extract available types, brands, sizes, max price dynamically
  const { clothTypes, brands, sizes, maxAvailablePrice } = useMemo(() => {
    const typesSet = new Set<string>();
    const brandsSet = new Set<string>();
    const sizesSet = new Set<string>();
    let maxP = 0;

    products.forEach((p) => {
      if (p.clothType) typesSet.add(p.clothType);
      if (p.brand) brandsSet.add(p.brand);
      if (p.size) sizesSet.add(p.size);
      const effectivePrice = p.discount
        ? Math.round(p.price * (1 - p.discount / 100))
        : p.price;
      if (effectivePrice > maxP) maxP = effectivePrice;
    });

    return {
      clothTypes: Array.from(typesSet).sort(),
      brands: Array.from(brandsSet).sort(),
      sizes: Array.from(sizesSet).sort(),
      maxAvailablePrice: maxP || 10000,
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          const matchTitle = product.title?.toLowerCase().includes(q);
          const matchBrand = product.brand?.toLowerCase().includes(q);
          const matchDesc = product.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc) return false;
        }

        // Cloth Type filter
        if (
          filters.clothType !== "all" &&
          product.clothType !== filters.clothType
        ) {
          return false;
        }

        // Brand filter
        if (filters.brand !== "all" && product.brand !== filters.brand) {
          return false;
        }

        // Size filter
        if (filters.size !== "all" && product.size !== filters.size) {
          return false;
        }

        // Price filter
        const finalPrice = product.discount
          ? Math.round(product.price * (1 - product.discount / 100))
          : product.price;

        if (filters.maxPrice !== "" && finalPrice > Number(filters.maxPrice)) {
          return false;
        }

        // In stock filter
        if (filters.inStockOnly && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const getPrice = (p: typeof a) =>
          p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price;

        if (filters.sortBy === "price-asc") {
          return getPrice(a) - getPrice(b);
        }
        if (filters.sortBy === "price-desc") {
          return getPrice(b) - getPrice(a);
        }
        // Default "newest"
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters(initialFilterState);
  };

  return (
    <main className="page-container">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Products
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          Browse our curated collection of clothing & items
        </p>
      </div>

      {/* Mobile Filter Trigger Button */}
      <div className="md:hidden flex items-center justify-between mb-6 pb-4 border-b border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter & Sort</span>
        </Button>
        <span className="text-xs text-muted-foreground font-medium">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Mobile Sidepanel (Sheet) */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <ProductFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            clothTypes={clothTypes}
            brands={brands}
            sizes={sizes}
            maxAvailablePrice={maxAvailablePrice}
            totalCount={products.length}
            filteredCount={filteredProducts.length}
          />
        </SheetContent>
      </Sheet>

      {/* Main Layout: Left Sidebar + Product Grid */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Left Sidebar Filter */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 border border-border rounded-xl p-6 bg-card shadow-sm sticky top-24">
          <ProductFilter
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
            clothTypes={clothTypes}
            brands={brands}
            sizes={sizes}
            maxAvailablePrice={maxAvailablePrice}
            totalCount={products.length}
            filteredCount={filteredProducts.length}
          />
        </aside>

        {/* Product Grid / States Area */}
        <section className="flex-1 w-full min-w-0">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-6 text-center">
              <p className="text-destructive font-medium">
                Unable to load products
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Try again later
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && (products.length === 0 || filteredProducts.length === 0) && (
            <EmptyProducts />
          )}

          {/* Products Grid */}
          {!loading && !error && filteredProducts.length > 0 && (
            <ProductGrid products={filteredProducts} />
          )}
        </section>
      </div>
    </main>
  );
}
