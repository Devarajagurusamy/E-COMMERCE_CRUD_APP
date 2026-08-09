import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
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

    // Security check: Only fetch orders belonging to the logged-in customer
    const rawOrders = await Order.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .lean();

    const orders = rawOrders.map((ord: any) => {
      let derivedOrderStatus = ord.orderStatus;
      if (!derivedOrderStatus) {
        if (ord.status === "paid") derivedOrderStatus = "Confirmed";
        else if (ord.status === "failed") derivedOrderStatus = "Cancelled";
        else derivedOrderStatus = "Pending";
      }

      let derivedPaymentStatus = ord.paymentStatus;
      if (!derivedPaymentStatus) {
        if (ord.status === "paid") derivedPaymentStatus = "Paid";
        else if (ord.status === "failed") derivedPaymentStatus = "Failed";
        else derivedPaymentStatus = "Pending";
      }

      return {
        ...ord,
        orderStatus: derivedOrderStatus,
        paymentStatus: derivedPaymentStatus,
      };
    });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Customer Orders Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
