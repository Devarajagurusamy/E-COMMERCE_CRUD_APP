import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { loginSchema } from "@/lib/schemas/loginSchema";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils/generateToken";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate request body
        const validatedData = loginSchema.parse(body);

        // Find user by email
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password",
                },
                { status: 401 }
            );
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            validatedData.password,
            user.password
        );
        if (!passwordMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password",
                },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Create response with httpOnly cookie
        const response = NextResponse.json(
            {
                success: true,
                message: "Logged in successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;
    } catch (error: any) {
        // Handle validation errors
        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                    success: false,
                    message: error.errors[0].message,
                },
                { status: 400 }
            );
        }

        console.error("Login error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
