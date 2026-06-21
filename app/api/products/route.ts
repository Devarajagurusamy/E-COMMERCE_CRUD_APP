import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { productSchema } from "@/lib/schemas/productSchema";
import { verifyToken } from "@/lib/utils/verifyToken";

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const products = await Product.find()
            .select("title price discount clothType brand size color stock image")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                data: products,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get all products error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

// POST /api/products - Create product (Admin only)
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

        // Check if user is admin
        if (decoded.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden - Admin access required",
                },
                { status: 403 }
            );
        }

        const body = await request.json();

        // Validate request body
        const validatedData = productSchema.parse(body);

        // Create product
        const product = await Product.create(validatedData);

        return NextResponse.json(
            {
                success: true,
                message: "Product created successfully",
                data: product,
            },
            { status: 201 }
        );
    } catch (error: any) {
        // Handle validation errors
        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                    success: false,
                    message: error.issues?.[0]?.message || "Validation failed",
                },
                { status: 400 }
            );
        }

        console.error("Create product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
