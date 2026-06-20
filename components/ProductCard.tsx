"use client";

import { Product } from "@/lib/store/slices/productSlice";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const finalPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const inStock = product.stock > 0;

    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <CardHeader className="p-0 relative h-48 overflow-hidden bg-muted">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {product.discount}% OFF
                    </div>
                )}
            </CardHeader>

            {/* Product Details */}
            <CardContent className="flex-1 flex flex-col p-4 space-y-3">
                {/* Title */}
                <div className="min-h-[48px]">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-foreground">
                        {product.title}
                    </h3>
                </div>

                {/* Brand & Type */}
                <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {product.brand}
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                        {product.clothType}
                    </span>
                </div>

                {/* Price Section */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-lg md:text-xl font-bold text-foreground">
                            ₹{finalPrice}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-xs md:text-sm line-through text-muted-foreground">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stock Status */}
                <div className="text-xs font-medium">
                    {inStock ? (
                        <span className="text-green-600">✓ In Stock</span>
                    ) : (
                        <span className="text-red-600">✗ Out of Stock</span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-2">
                    <Link href={`/products/${product._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                            View Details
                        </Button>
                    </Link>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={!inStock}
                        className="flex-1"
                    >
                        {inStock ? "Add to Cart" : "Unavailable"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
