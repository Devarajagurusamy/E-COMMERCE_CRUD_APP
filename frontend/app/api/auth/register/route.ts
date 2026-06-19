import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { registerSchema } from "@/lib/schemas/registerSchema";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils/generateToken";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate request body
        const validatedData = registerSchema.parse(body);

        // Check if user already exists
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email already registered",
                },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create user
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            role: "user",
        });

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
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
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

        console.error("Register error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
