import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/verifyToken";
import mongoose from "mongoose";

const VALID_ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const VALID_PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).populate("userId", "name email").lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const user = (order as any).userId || {};
    const customerName =
      (order as any).customerDetails?.name || user.name || "Guest Customer";
    const customerEmail =
      (order as any).customerDetails?.email || user.email || "N/A";
    const customerPhone =
      (order as any).customerDetails?.phone ||
      (order as any).shippingAddress?.phone ||
      "N/A";

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
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      shippingAddress: {
        recipientName:
          (order as any).shippingAddress?.recipientName || customerName,
        phone: (order as any).shippingAddress?.phone || customerPhone,
        address:
          (order as any).shippingAddress?.address ||
          "123 Main Street, Sector 4",
        city: (order as any).shippingAddress?.city || "Mumbai",
        state: (order as any).shippingAddress?.state || "Maharashtra",
        postalCode: (order as any).shippingAddress?.postalCode || "400001",
      },
    };

    return NextResponse.json(
      { success: true, order: formattedOrder },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Single Admin Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderStatus, paymentStatus } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (orderStatus) {
      if (!VALID_ORDER_STATUSES.includes(orderStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid order status. Allowed: ${VALID_ORDER_STATUSES.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
      order.orderStatus = orderStatus;

      // Update legacy status field for backward compatibility
      if (orderStatus === "Delivered" || orderStatus === "Confirmed" || orderStatus === "Processing" || orderStatus === "Shipped") {
        order.status = "paid";
      } else if (orderStatus === "Cancelled") {
        order.status = "failed";
      } else if (orderStatus === "Refunded") {
        order.status = "failed";
        order.paymentStatus = "Refunded";
      }
    }

    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid payment status. Allowed: ${VALID_PAYMENT_STATUSES.join(
              ", "
            )}`,
          },
          { status: 400 }
        );
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated successfully",
        order: {
          _id: order._id,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          status: order.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Admin Order Status Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update order status" },
      { status: 500 }
    );
  }
}
