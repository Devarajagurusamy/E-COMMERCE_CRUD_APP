import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/verifyToken";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify Admin authentication
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

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const orderStatus = searchParams.get("orderStatus") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sort = searchParams.get("sort") || "newest";

    // Build filter query
    const filter: any = {};

    // Filter by Order Status
    if (orderStatus !== "all") {
      filter.$or = filter.$or || [];
      filter.orderStatus = orderStatus;
    }

    // Filter by Payment Status
    if (paymentStatus !== "all") {
      if (paymentStatus === "Paid") {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [{ paymentStatus: "Paid" }, { status: "paid" }],
        });
      } else if (paymentStatus === "Pending") {
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [{ paymentStatus: "Pending" }, { status: "pending" }],
        });
      } else {
        filter.paymentStatus = paymentStatus;
      }
    }

    // Filter by Date Range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Fetch all orders with user details populated for accurate filtering
    let orders = await Order.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: sort === "oldest" ? 1 : -1 })
      .lean();

    // Map and fallback missing historical data for older database records
    let mappedOrders = orders.map((order: any) => {
      const user = order.userId || {};
      const customerName =
        order.customerDetails?.name || user.name || "Guest Customer";
      const customerEmail =
        order.customerDetails?.email || user.email || "N/A";
      const customerPhone =
        order.customerDetails?.phone ||
        order.shippingAddress?.phone ||
        "N/A";

      // Derive normalized order status if missing in legacy records
      let derivedOrderStatus = order.orderStatus;
      if (!derivedOrderStatus) {
        if (order.status === "paid") {
          derivedOrderStatus = "Confirmed";
        } else if (order.status === "failed") {
          derivedOrderStatus = "Cancelled";
        } else {
          derivedOrderStatus = "Pending";
        }
      }

      // Derive normalized payment status if missing in legacy records
      let derivedPaymentStatus = order.paymentStatus;
      if (!derivedPaymentStatus) {
        if (order.status === "paid") {
          derivedPaymentStatus = "Paid";
        } else if (order.status === "failed") {
          derivedPaymentStatus = "Failed";
        } else {
          derivedPaymentStatus = "Pending";
        }
      }

      return {
        ...order,
        orderStatus: derivedOrderStatus,
        paymentStatus: derivedPaymentStatus,
        customerDetails: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        shippingAddress: {
          recipientName:
            order.shippingAddress?.recipientName || customerName,
          phone: order.shippingAddress?.phone || customerPhone,
          address:
            order.shippingAddress?.address ||
            "123 Main Street, Sector 4",
          city: order.shippingAddress?.city || "Mumbai",
          state: order.shippingAddress?.state || "Maharashtra",
          postalCode: order.shippingAddress?.postalCode || "400001",
        },
      };
    });

    // Apply Search Filter across Order ID, customer name, customer email
    if (search) {
      const searchLower = search.toLowerCase();
      mappedOrders = mappedOrders.filter((order) => {
        const orderIdMatch =
          order._id.toString().toLowerCase().includes(searchLower) ||
          (order.razorpayOrderId &&
            order.razorpayOrderId.toLowerCase().includes(searchLower));
        const nameMatch =
          order.customerDetails.name.toLowerCase().includes(searchLower);
        const emailMatch =
          order.customerDetails.email.toLowerCase().includes(searchLower);
        return orderIdMatch || nameMatch || emailMatch;
      });
    }

    // Calculate Overview Statistics
    const allOrdersRaw = await Order.find().lean();
    const stats = {
      totalOrders: allOrdersRaw.length,
      pendingOrders: 0,
      confirmedOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      refundedOrders: 0,
    };

    allOrdersRaw.forEach((ord: any) => {
      const status =
        ord.orderStatus ||
        (ord.status === "paid" ? "Confirmed" : ord.status === "failed" ? "Cancelled" : "Pending");

      if (status === "Pending") stats.pendingOrders++;
      else if (status === "Confirmed") stats.confirmedOrders++;
      else if (status === "Processing") stats.processingOrders++;
      else if (status === "Shipped") stats.shippedOrders++;
      else if (status === "Delivered") stats.deliveredOrders++;
      else if (status === "Cancelled") stats.cancelledOrders++;
      else if (status === "Refunded") stats.refundedOrders++;
    });

    return NextResponse.json(
      {
        success: true,
        stats,
        orders: mappedOrders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch Admin Orders Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
