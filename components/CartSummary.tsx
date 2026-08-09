"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { fetchCart } from "@/lib/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { CreditCard, Loader2 } from "lucide-react";

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

    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCancelOrder = async (razorpayOrderId: string) => {
        try {
            await axiosInstance.post("/api/checkout/cancel", {
                razorpay_order_id: razorpayOrderId,
            });
        } catch (err) {
            console.error("Failed to update cancelled order status:", err);
        }
    };

    const handleCheckout = async () => {
        setCheckoutError(null);
        setIsCheckingOut(true);

        try {
            // 1. Create order on server
            const { data } = await axiosInstance.post("/api/checkout/create-order");

            if (!data.success) {
                setCheckoutError(data.message || "Failed to initiate order");
                setIsCheckingOut(false);
                return;
            }

            // 2. Load Razorpay script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                setCheckoutError("Razorpay SDK failed to load. Are you online?");
                setIsCheckingOut(false);
                return;
            }

            // 3. Open Razorpay Modal Window
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "E-Commerce Clothing Store",
                description: "Purchase Checkout",
                order_id: data.razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment Signature
                        const verifyRes = await axiosInstance.post(
                            "/api/checkout/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }
                        );

                        if (verifyRes.data.success) {
                            dispatch(fetchCart());
                            router.push(
                                `/orders/success?orderId=${verifyRes.data.orderId}`
                            );
                        } else {
                            setCheckoutError(
                                verifyRes.data.message ||
                                    "Payment verification failed"
                            );
                            await handleCancelOrder(data.razorpayOrderId);
                        }
                    } catch (err: any) {
                        setCheckoutError(
                            err.response?.data?.message ||
                                "Error verifying payment signature"
                        );
                        await handleCancelOrder(data.razorpayOrderId);
                    } finally {
                        setIsCheckingOut(false);
                    }
                },
                modal: {
                    ondismiss: async function () {
                        setIsCheckingOut(false);
                        await handleCancelOrder(data.razorpayOrderId);
                    },
                },
                theme: {
                    color: "#18181b",
                },
            };

            const razorpayWindow = new (window as any).Razorpay(options);

            // Handle explicit payment failure event inside modal
            razorpayWindow.on("payment.failed", async function (response: any) {
                setCheckoutError(
                    response.error?.description || "Payment failed or cancelled."
                );
                await handleCancelOrder(data.razorpayOrderId);
                setIsCheckingOut(false);
            });

            razorpayWindow.open();
        } catch (error: any) {
            console.error("Checkout Error:", error);
            setCheckoutError(
                error.response?.data?.message ||
                    "An error occurred during checkout. Please log in first."
            );
            setIsCheckingOut(false);
        }
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


