import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { verifyToken } from "@/lib/utils/verifyToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const [lowStock, pendingOrders] = await Promise.all([
      Product.find({ stock: { $lte: 5 } }).limit(5).lean(),
      Order.find({ orderStatus: "Pending" }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: "inventory" | "order" | "system";
      time: string;
      url: string;
      read: boolean;
    }> = [];

    lowStock.forEach((p: any) => {
      notifications.push({
        id: `inv-${p._id}`,
        title: p.stock === 0 ? "Product Out of Stock" : "Low Stock Alert",
        message: `${p.title} has only ${p.stock} item(s) left in stock.`,
        type: "inventory",
        time: "Just now",
        url: "/admin/products",
        read: false,
      });
    });

    pendingOrders.forEach((o: any) => {
      notifications.push({
        id: `ord-${o._id}`,
        title: "New Order Pending Action",
        message: `Order #${o._id.toString().slice(-6).toUpperCase()} from ${
          o.customerDetails?.name || "Customer"
        } needs confirmation.`,
        type: "order",
        time: new Date(o.createdAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        url: `/admin/orders/${o._id}`,
        read: false,
      });
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: notifications.length,
    });
  } catch (error) {
    console.error("Notifications API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
