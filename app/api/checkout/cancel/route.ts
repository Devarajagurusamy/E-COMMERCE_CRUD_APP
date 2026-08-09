import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
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
    const { razorpay_order_id } = body;

    if (!razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Missing order ID" },
        { status: 400 }
      );
    }

    // Find pending order and mark it as failed/cancelled
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (order && order.status === "pending") {
      order.status = "failed";
      await order.save();
    }

    return NextResponse.json(
      { success: true, message: "Order status updated to failed" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
