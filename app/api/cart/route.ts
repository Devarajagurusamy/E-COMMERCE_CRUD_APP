import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";
import { verifyToken } from "@/lib/utils/verifyToken";
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

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
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

        const userId = decoded.id;

        // Find user's cart and populate product details
        let cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "title price discount image stock",
        });

        if (!cart) {
            return NextResponse.json(
                {
                    success: true,
                    data: {
                        items: [],
                        totalItems: 0,
                        totalPrice: 0,
                    },
                },
                { status: 200 }
            );
        }

        // Transform items to match expected format
        const items = cart.items.map((item: any) => ({
            product: item.productId,
            quantity: item.quantity,
        }));

        const { totalItems, totalPrice } = await calculateTotals(items);

        return NextResponse.json(
            {
                success: true,
                data: {
                    items,
                    totalItems,
                    totalPrice,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get cart error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

// POST /api/cart - Add to cart
export async function POST(request: NextRequest) {
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

        const userId = decoded.id;
        const body = await request.json();
        const { productId, quantity } = body;

        // Validate input
        if (!productId || !quantity || quantity < 1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID or quantity",
                },
                { status: 400 }
            );
        }

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

        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        if (product.stock <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product out of stock",
                },
                { status: 400 }
            );
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(
            (item: any) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.price,
            });
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
                message: "Product added to cart",
                data: {
                    items,
                    totalItems,
                    totalPrice,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Add to cart error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

// PUT /api/cart - Update cart quantity
export async function PUT(request: NextRequest) {
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

        const userId = decoded.id;
        const body = await request.json();
        const { productId, quantity } = body;

        // Validate input
        if (!productId || quantity === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID or quantity",
                },
                { status: 400 }
            );
        }

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

        // Find item in cart
        const itemIndex = cart.items.findIndex(
            (item: any) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item not in cart",
                },
                { status: 404 }
            );
        }

        // If quantity is 0 or less, remove item
        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            // Check product stock
            const product = await Product.findById(productId);
            if (!product || product.stock <= 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product out of stock",
                    },
                    { status: 400 }
                );
            }

            cart.items[itemIndex].quantity = quantity;
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
                message: "Cart updated",
                data: {
                    items,
                    totalItems,
                    totalPrice,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update cart error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
