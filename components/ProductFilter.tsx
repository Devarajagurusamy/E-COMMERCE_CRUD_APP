"use client";

import { SlidersHorizontal, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterState {
    search: string;
    clothType: string;
    brand: string;
    size: string;
    maxPrice: number | "";
    inStockOnly: boolean;
    sortBy: "newest" | "price-asc" | "price-desc";
}

interface ProductFilterProps {
    filters: FilterState;
    onFilterChange: (updated: FilterState) => void;
    onReset: () => void;
    clothTypes: string[];
    brands: string[];
    sizes: string[];
    maxAvailablePrice: number;
    totalCount: number;
    filteredCount: number;
}

export default function ProductFilter({
    filters,
    onFilterChange,
    onReset,
    clothTypes,
    brands,
    sizes,
    maxAvailablePrice,
    totalCount,
    filteredCount,
}: ProductFilterProps) {
    const isFiltered =
        filters.search !== "" ||
        filters.clothType !== "all" ||
        filters.brand !== "all" ||
        filters.size !== "all" ||
        filters.maxPrice !== "" ||
        filters.inStockOnly ||
        filters.sortBy !== "newest";

    const handleChange = <K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                </div>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="text-xs text-muted-foreground hover:text-foreground h-8 px-2 flex items-center gap-1"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Search Input */}
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sort By
                </label>
                <select
                    value={filters.sortBy}
                    onChange={(e) =>
                        handleChange(
                            "sortBy",
                            e.target.value as FilterState["sortBy"]
                        )
                    }
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            {/* Cloth Type Filter */}
            {clothTypes.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category / Type
                    </label>
                    <select
                        value={filters.clothType}
                        onChange={(e) => handleChange("clothType", e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                        <option value="all">All Types</option>
                        {clothTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Brand Filter */}
            {brands.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Brand
                    </label>
                    <select
                        value={filters.brand}
                        onChange={(e) => handleChange("brand", e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    >
                        <option value="all">All Brands</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Size Filter */}
            {sizes.length > 0 && (
                <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Size
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => handleChange("size", "all")}
                            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                                filters.size === "all"
                                    ? "bg-primary text-primary-foreground border-primary font-medium"
                                    : "bg-background border-border text-foreground hover:bg-muted"
                            }`}
                        >
                            All
                        </button>
                        {sizes.map((sz) => (
                            <button
                                key={sz}
                                type="button"
                                onClick={() => handleChange("size", sz)}
                                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                                    filters.size === sz
                                        ? "bg-primary text-primary-foreground border-primary font-medium"
                                        : "bg-background border-border text-foreground hover:bg-muted"
                                }`}
                            >
                                {sz}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Max Price Range Filter */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Max Price
                    </label>
                    <span className="text-xs font-medium text-foreground">
                        {filters.maxPrice === ""
                            ? `₹${maxAvailablePrice || 10000}`
                            : `₹${filters.maxPrice}`}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max={maxAvailablePrice || 10000}
                    step="100"
                    value={
                        filters.maxPrice === ""
                            ? maxAvailablePrice || 10000
                            : filters.maxPrice
                    }
                    onChange={(e) =>
                        handleChange("maxPrice", Number(e.target.value))
                    }
                    className="w-full accent-primary cursor-pointer"
                />
            </div>

            {/* In Stock Only Toggle */}
            <div className="pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={filters.inStockOnly}
                        onChange={(e) =>
                            handleChange("inStockOnly", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span>In Stock Only</span>
                </label>
            </div>

            {/* Results Counter */}
            <div className="text-xs text-muted-foreground pt-2">
                Showing {filteredCount} of {totalCount} product{totalCount !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
