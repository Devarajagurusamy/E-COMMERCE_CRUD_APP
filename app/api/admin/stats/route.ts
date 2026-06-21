import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import { User } from "@/lib/models/User";
import { Product } from "@/lib/models/Product";
import { Cart } from "@/lib/models/Cart";

import { verifyToken } from "@/lib/utils/generateToken";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get token from cookie
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

        // Verify token
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

        // Admin only
        if (decoded.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden - Admin access required",
                },
                { status: 403 }
            );
        }

        // Get counts
        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const carts = await Cart.find();

        let totalCartItems = 0;

        carts.forEach((cart) => {
            totalCartItems += cart.items.length;
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    totalUsers,
                    totalProducts,
                    totalCartItems,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Admin stats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}