"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/store/slices/productSlice";
import { AppDispatch, RootState } from "@/lib/store";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeleton from "@/components/ProductSkeleton";
import EmptyProducts from "@/components/EmptyProducts";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <main className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Products</h1>
        <p className="text-muted-foreground">
          Browse our collection of products
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
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
      {!loading && !error && products.length === 0 && <EmptyProducts />}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
