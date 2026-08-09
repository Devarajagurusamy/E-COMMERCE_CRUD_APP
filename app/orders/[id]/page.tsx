"use client";

import { useEffect, useState, use } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  CheckCheck,
  XCircle,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetail {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: OrderItem[];
  createdAt: string;
}

const ORDER_FLOW = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

export default function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/user/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err: any) {
        console.error("Failed to fetch order details:", err);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, router]);

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Processing":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Shipped":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Refunded":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Refunded":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto py-16 text-center">
        <p className="text-muted-foreground text-sm">Loading order details...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-5xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-sm text-muted-foreground">
          We could not find the requested order in your account.
        </p>
        <Link href="/orders">
          <Button variant="default">Back to My Orders</Button>
        </Link>
      </main>
    );
  }

  const currentStatusIndex = ORDER_FLOW.indexOf(order.orderStatus);

  return (
    <main className="max-w-5xl mx-auto space-y-6 py-8 px-4 md:px-6">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/orders">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">
          Order #{order._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-card border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getOrderStatusBadgeClass(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPaymentStatusBadgeClass(
                order.paymentStatus
              )}`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-muted-foreground">Total Order Amount</p>
          <p className="text-3xl font-extrabold text-foreground">
            ₹{order.totalAmount}
          </p>
        </div>
      </div>

      {/* VISUAL ORDER STATUS PROGRESSION TIMELINE */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            <span>Order Delivery Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between relative px-2 py-4">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-muted -z-0" />
            {ORDER_FLOW.map((flowStep, idx) => {
              const isCompleted =
                currentStatusIndex >= 0 && idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div
                  key={flowStep}
                  className="relative z-10 flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground border border-border"
                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden sm:inline ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {flowStep}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CUSTOMER DETAILS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Customer Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold text-foreground">
                {order.customerDetails?.name || "Customer"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-semibold text-foreground">
                {order.customerDetails?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="font-semibold text-foreground">
                {order.customerDetails?.phone || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SHIPPING DETAILS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Delivery Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Recipient Name</p>
              <p className="font-semibold text-foreground">
                {order.shippingAddress?.recipientName || order.customerDetails?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Complete Address</p>
              <p className="font-semibold text-foreground">
                {order.shippingAddress?.address}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">City: </span>
                <span className="font-semibold text-foreground">
                  {order.shippingAddress?.city}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">State: </span>
                <span className="font-semibold text-foreground">
                  {order.shippingAddress?.state}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">PIN Code: </span>
                <span className="font-semibold text-foreground">
                  {order.shippingAddress?.postalCode}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PRODUCT DETAILS TABLE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>Purchased Items ({order.items.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase font-medium">
                  <th className="text-left py-3 px-4">Product Image</th>
                  <th className="text-left py-3 px-4">Product Name</th>
                  <th className="text-center py-3 px-4">Purchase Price</th>
                  <th className="text-center py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted border">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground">
                      {item.title}
                    </td>

                    <td className="py-3 px-4 text-center">
                      ₹{item.price}
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
                      {item.quantity}
                    </td>

                    <td className="py-3 px-4 text-right font-extrabold text-foreground">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PAYMENT DETAILS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground text-xs">Payment Method:</span>
              <span className="font-semibold text-foreground">
                {order.paymentMethod || "Razorpay Online"}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground text-xs">Payment Status:</span>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPaymentStatusBadgeClass(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-border">
              <span className="text-muted-foreground text-xs">Payment Reference ID:</span>
              <span className="font-mono text-xs font-semibold text-foreground">
                {order.razorpayPaymentId || order.razorpayOrderId}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground text-xs">Payment Date:</span>
              <span className="text-xs font-semibold text-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ORDER SUMMARY */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">₹{order.subtotal}</span>
            </div>

            <div className="flex justify-between text-muted-foreground text-xs">
              <span>Delivery / Shipping Charge:</span>
              <span className="font-semibold text-emerald-600">
                {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Discount:</span>
                <span className="font-semibold text-emerald-600">
                  -₹{order.discountAmount}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-bold text-base text-foreground">Final Total:</span>
              <span className="font-extrabold text-2xl text-foreground">
                ₹{order.totalAmount}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
