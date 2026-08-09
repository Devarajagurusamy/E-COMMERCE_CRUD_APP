import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Address } from "@/lib/models/Address";
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

    const addresses = await Address.find({ userId: payload.id }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json(
      { success: true, addresses },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Addresses Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const {
      recipientName,
      phone,
      addressLine,
      building,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = body;

    if (!recipientName || !phone || !addressLine || !city || !state || !postalCode) {
      return NextResponse.json(
        { success: false, message: "All address fields are required" },
        { status: 400 }
      );
    }

    // Check if user has existing addresses
    const existingCount = await Address.countDocuments({ userId: payload.id });
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany({ userId: payload.id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId: payload.id,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      building: building ? building.trim() : "",
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country ? country.trim() : "India",
      isDefault: shouldBeDefault,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Address Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add address" },
      { status: 500 }
    );
  }
}
