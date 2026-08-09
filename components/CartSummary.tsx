"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import { processCheckout } from "@/lib/utils/checkout";

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
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const handleCheckout = () => {
        processCheckout({
            dispatch,
            router,
            setIsCheckingOut,
            setCheckoutError,
        });
    };

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

            {checkoutError && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
                    {checkoutError}
                </div>
            )}

            <Button
                size="lg"
                className="w-full gap-2"
                disabled={totalItems === 0 || isLoading || isCheckingOut}
                onClick={handleCheckout}
            >
                {isCheckingOut ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="h-4 w-4" />
                        <span>Proceed To Checkout</span>
                    </>
                )}
            </Button>

            <Link href="/products" className="block w-full">
                <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                </Button>
            </Link>
        </div>
    );
}


