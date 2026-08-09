import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { Order } from "@/lib/models/Order";
import { verifyToken } from "@/lib/utils/verifyToken";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify User Token
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
        { success: false, message: "Invalid session token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server secret missing" },
        { status: 500 }
      );
    }

    // Compute expected HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Secure constant-time comparison
    const isSignatureValid = generatedSignature === razorpay_signature;

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (isSignatureValid) {
      // Update order status to paid and confirmed
      order.status = "paid";
      order.paymentStatus = "Paid";
      order.orderStatus = "Confirmed";
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      await order.save();

      // Clear user cart in database
      await Cart.deleteOne({ userId: payload.id });

      return NextResponse.json(
        {
          success: true,
          message: "Payment verified successfully",
          orderId: order._id,
        },
        { status: 200 }
      );
    } else {
      // Update order status to failed
      order.status = "failed";
      order.paymentStatus = "Failed";
      await order.save();

      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
