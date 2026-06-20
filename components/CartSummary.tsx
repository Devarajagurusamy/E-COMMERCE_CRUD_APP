"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartSummaryProps {
    totalItems: number;
    totalPrice: number;
    isLoading?: boolean;
}

export default function CartSummary({
    totalItems,
    totalPrice,
    isLoading = false,
}: CartSummaryProps) {
    return (
        <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-semibold text-foreground">{totalItems}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total Price:</span>
                    <span className="text-lg font-bold text-foreground">
                        ₹{totalPrice}
                    </span>
                </div>
            </div>

            <Link href="/" className="block w-full">
                <Button
                    size="lg"
                    className="w-full"
                    disabled={totalItems === 0 || isLoading}
                >
                    Proceed To Checkout
                </Button>
            </Link>

            <Link href="/products" className="block w-full">
                <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                </Button>
            </Link>
        </div>
    );
}
