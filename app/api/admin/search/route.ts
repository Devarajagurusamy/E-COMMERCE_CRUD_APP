import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models/User";
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
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: { products: [], orders: [], users: [], customers: [] },
      });
    }

    const regex = new RegExp(query.trim(), "i");

    // Concurrently search products, orders, and users
    const [products, orders, users] = await Promise.all([
      Product.find({
        $or: [{ title: regex }, { brand: regex }, { clothType: regex }],
      })
        .limit(5)
        .lean(),

      Order.find({
        $or: [
          { razorpayOrderId: regex },
          { "customerDetails.name": regex },
          { "customerDetails.email": regex },
        ],
      })
        .limit(5)
        .lean(),

      User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .limit(5)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products: products.map((p: any) => ({
          id: p._id.toString(),
          type: "PRODUCT",
          title: p.title,
          subtitle: `${p.brand} • ₹${p.price} • Stock: ${p.stock}`,
          image: p.image,
          url: `/admin/products`,
        })),
        orders: orders.map((o: any) => ({
          id: o._id.toString(),
          type: "ORDER",
          title: `Order #${o._id.toString().slice(-6).toUpperCase()}`,
          subtitle: `${o.customerDetails?.name || "Customer"} • ₹${o.totalAmount} • ${o.orderStatus}`,
          url: `/admin/orders/${o._id.toString()}`,
        })),
        users: users.map((u: any) => ({
          id: u._id.toString(),
          type: u.role === "admin" ? "USER" : "CUSTOMER",
          title: u.name,
          subtitle: `${u.email} (${u.role})`,
          url: `/admin/users`,
        })),
      },
    });
  } catch (error) {
    console.error("Universal search API error:", error);
    return NextResponse.json(
      { success: false, message: "Search error" },
      { status: 500 }
    );
  }
}
