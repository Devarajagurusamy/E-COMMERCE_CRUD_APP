import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { verifyToken } from "@/lib/utils/verifyToken";
import mongoose from "mongoose";

export async function GET(
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
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Security check: Only fetch if order belongs to logged-in customer
    const order = await Order.findOne({ _id: id, userId: payload.id }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let derivedOrderStatus = (order as any).orderStatus;
    if (!derivedOrderStatus) {
      if ((order as any).status === "paid") derivedOrderStatus = "Confirmed";
      else if ((order as any).status === "failed") derivedOrderStatus = "Cancelled";
      else derivedOrderStatus = "Pending";
    }

    let derivedPaymentStatus = (order as any).paymentStatus;
    if (!derivedPaymentStatus) {
      if ((order as any).status === "paid") derivedPaymentStatus = "Paid";
      else if ((order as any).status === "failed") derivedPaymentStatus = "Failed";
      else derivedPaymentStatus = "Pending";
    }

    const subtotal =
      (order as any).subtotal ||
      (order as any).items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );

    const formattedOrder = {
      ...order,
      subtotal,
      shippingFee: (order as any).shippingFee || 0,
      discountAmount: (order as any).discountAmount || 0,
      paymentMethod: (order as any).paymentMethod || "Razorpay",
      orderStatus: derivedOrderStatus,
      paymentStatus: derivedPaymentStatus,
    };

    return NextResponse.json(
      { success: true, order: formattedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Single Customer Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
