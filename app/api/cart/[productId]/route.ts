import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { verifyToken } from "@/lib/utils/generateToken";
import mongoose from "mongoose";

// Helper function to calculate totals
async function calculateTotals(cartItems: any[]) {
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cartItems) {
        totalItems += item.quantity;
        const finalPrice = item.product.discount
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price;
        totalPrice += finalPrice * item.quantity;
    }

    return {
        totalItems: Math.round(totalItems),
        totalPrice: Math.round(totalPrice),
    };
}

// DELETE /api/cart/[productId] - Remove item from cart
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        await connectDB();

        // Get and verify token
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized - No token provided",
                },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized - Invalid token",
                },
                { status: 401 }
            );
        }

        const { productId } = await params;
        const userId = decoded.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400 }
            );
        }

        // Find cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart not found",
                },
                { status: 404 }
            );
        }

        // Remove item from cart
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(
            (item: any) => item.productId.toString() !== productId
        );

        // Check if item was removed
        if (cart.items.length === initialLength) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item not in cart",
                },
                { status: 404 }
            );
        }

        await cart.save();

        // Get updated cart with populated products
        cart = await cart.populate({
            path: "items.productId",
            select: "title price discount image stock",
        });

        const items = cart.items.map((item: any) => ({
            product: item.productId,
            quantity: item.quantity,
        }));

        const { totalItems, totalPrice } = await calculateTotals(items);

        return NextResponse.json(
            {
                success: true,
                message: "Item removed from cart",
                data: {
                    items,
                    totalItems,
                    totalPrice,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Remove from cart error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
