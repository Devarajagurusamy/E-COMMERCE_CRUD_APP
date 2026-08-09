import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Address } from "@/lib/models/Address";
import { verifyToken } from "@/lib/utils/verifyToken";
import mongoose from "mongoose";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid address ID" },
        { status: 400 }
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

    const address = await Address.findOne({ _id: id, userId: payload.id });
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    if (isDefault) {
      await Address.updateMany({ userId: payload.id }, { isDefault: false });
    }

    address.recipientName = recipientName ? recipientName.trim() : address.recipientName;
    address.phone = phone ? phone.trim() : address.phone;
    address.addressLine = addressLine ? addressLine.trim() : address.addressLine;
    address.building = building !== undefined ? building.trim() : address.building;
    address.city = city ? city.trim() : address.city;
    address.state = state ? state.trim() : address.state;
    address.postalCode = postalCode ? postalCode.trim() : address.postalCode;
    address.country = country ? country.trim() : address.country;
    if (isDefault !== undefined) {
      address.isDefault = isDefault;
    }

    await address.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully",
        address,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Address Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update address" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid address ID" },
        { status: 400 }
      );
    }

    const deleted = await Address.findOneAndDelete({
      _id: id,
      userId: payload.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // If deleted address was default, make the most recent remaining address default
    if (deleted.isDefault) {
      const remaining = await Address.findOne({ userId: payload.id }).sort({ createdAt: -1 });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }

    return NextResponse.json(
      { success: true, message: "Address deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Address Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete address" },
      { status: 500 }
    );
  }
}
