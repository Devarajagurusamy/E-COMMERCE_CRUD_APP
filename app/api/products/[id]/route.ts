import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Cart } from "@/lib/models/Cart";
import { productSchema, updateProductSchema } from "@/lib/schemas/productSchema";
import { verifyToken } from "@/lib/utils/verifyToken";
import mongoose from "mongoose";

// GET /api/products/[id] - Get product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400 }
            );
        }

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: product,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400 }
            );
        }

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
        const validatedData = updateProductSchema.parse(body);

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            validatedData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                data: updatedProduct,
            },
            { status: 200 }
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

        console.error("Update product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400 }
            );
        }

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

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        // Prevent carts from retaining a reference to a product that no longer exists.
        await Cart.updateMany(
            { "items.productId": deletedProduct._id },
            { $pull: { items: { productId: deletedProduct._id } } }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete product error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
