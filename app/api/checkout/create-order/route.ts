import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Cart } from "@/lib/models/Cart";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { verifyToken } from "@/lib/utils/verifyToken";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify User Token from httpOnly cookie
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

    // Find User Cart
    const cart = await Cart.findOne({ userId: payload.id }).populate(
      "items.productId"
    );

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Calculate total amount securely on server
    let totalAmount = 0;
    const orderItems = cart.items.map((item: any) => {
      const prod = item.productId;
      const unitPrice = prod?.discount
        ? Math.round(prod.price * (1 - prod.discount / 100))
        : item.price || prod?.price || 0;

      const lineTotal = unitPrice * item.quantity;
      totalAmount += lineTotal;

      return {
        productId: prod?._id || item.productId,
        title: prod?.title || "Product",
        quantity: item.quantity,
        price: unitPrice,
        image: prod?.image || "",
      };
    });

    if (totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid order amount" },
        { status: 400 }
      );
    }

    // Initialize Razorpay Instance
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, message: "Razorpay credentials not configured in .env.local" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create Razorpay Order (amount in paise: 1 INR = 100 paise)
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Find User Details for customer snapshot
    const userDoc = await User.findById(payload.id);
    const customerName = userDoc?.name || payload.email?.split("@")[0] || "Customer";
    const customerEmail = userDoc?.email || payload.email || "";

    // Save pending Order in MongoDB
    const newOrder = await Order.create({
      userId: payload.id,
      items: orderItems,
      subtotal: totalAmount,
      shippingFee: 0,
      discountAmount: 0,
      totalAmount: totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: "+91 98765 43210",
      },
      shippingAddress: {
        recipientName: customerName,
        phone: "+91 98765 43210",
        address: "123 Main Street, Sector 4",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
      },
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
