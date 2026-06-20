"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/store/slices/cartSlice";

interface CartItemProps {
    item: CartItemType;
    onIncrease: (productId: string) => void;
    onDecrease: (productId: string) => void;
    onRemove: (productId: string) => void;
    isLoading?: boolean;
}

export default function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
    isLoading = false,
}: CartItemProps) {
    const finalPrice = item.product.discount
        ? Math.round(item.product.price * (1 - item.product.discount / 100))
        : item.product.price;

    const subtotal = finalPrice * item.quantity;

    return (
        <div className="flex gap-4 p-4 border border-border rounded-lg">
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                    src={item.product.image}
                    alt={item.product.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="100px"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-sm md:text-base text-foreground line-clamp-2">
                        {item.product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        ₹{finalPrice} each
                    </p>
                    {item.product.discount > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                            Save ₹{item.product.price - finalPrice}
                        </p>
                    )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onDecrease(item.product._id)}
                        disabled={isLoading || item.quantity <= 1}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onIncrease(item.product._id)}
                        disabled={isLoading || item.quantity >= item.product.stock}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Price and Remove */}
            <div className="flex flex-col justify-between items-end">
                <p className="font-bold text-foreground">₹{subtotal}</p>
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => onRemove(item.product._id)}
                    disabled={isLoading}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
