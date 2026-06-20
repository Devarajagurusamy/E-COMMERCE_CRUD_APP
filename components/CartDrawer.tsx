"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import {
    updateCartQuantity,
    removeFromCart,
    fetchCart,
} from "@/lib/store/slices/cartSlice";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import EmptyProducts from "@/components/EmptyProducts";
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";

interface CartDrawerProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function CartDrawer({
    open: controlledOpen,
    onOpenChange,
}: CartDrawerProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { items, totalItems, totalPrice, loading } = useSelector(
        (state: RootState) => state.cart
    );

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleIncrease = (productId: string) => {
        const item = items.find((item) => item.product._id === productId);
        if (item) {
            dispatch(
                updateCartQuantity({
                    productId,
                    quantity: item.quantity + 1,
                })
            );
        }
    };

    const handleDecrease = (productId: string) => {
        const item = items.find((item) => item.product._id === productId);
        if (item && item.quantity > 1) {
            dispatch(
                updateCartQuantity({
                    productId,
                    quantity: item.quantity - 1,
                })
            );
        }
    };

    const handleRemove = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    return (
        <Sheet open={controlledOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col h-full py-4 gap-4">
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {loading && items.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Loading cart...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center space-y-4">
                                    <p className="text-muted-foreground">Your cart is empty</p>
                                    <SheetClose asChild>
                                        <Button variant="outline" size="sm">
                                            Continue Shopping
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>
                        ) : (
                            items.map((item) => (
                                <CartItem
                                    key={item.product._id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                    isLoading={loading}
                                />
                            ))
                        )}
                    </div>

                    {/* Cart Summary */}
                    {items.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <CartSummary
                                totalItems={totalItems}
                                totalPrice={totalPrice}
                                isLoading={loading}
                            />
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
