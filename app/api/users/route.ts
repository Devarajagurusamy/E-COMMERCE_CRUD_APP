import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";

import { verifyToken } from "@/lib/utils/verifyToken";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

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

        if (decoded.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Forbidden - Admin access required",
                },
                { status: 403 }
            );
        }

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                data: users,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get users error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}