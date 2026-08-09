import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Address } from "@/lib/models/Address";
import { Order } from "@/lib/models/Order";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.id).select("-password").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const addresses = await Address.find({ userId: payload.id }).sort({ isDefault: -1, createdAt: -1 }).lean();
    const recentOrders = await Order.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json(
      {
        success: true,
        user,
        addresses,
        recentOrders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get User Profile Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, avatar } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      {
        name: name.trim(),
        phone: phone ? phone.trim() : "",
        avatar: avatar ? avatar.trim() : "",
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
