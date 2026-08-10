"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Calendar,
  Eye,
  CreditCard,
  ArrowRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  razorpayOrderId: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  items: OrderItem[];
  createdAt: string;
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/user/orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err: any) {
        console.error("Fetch orders failed:", err);
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Shipped":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "Confirmed":
      case "Processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Cancelled":
      case "Failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Refunded":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Refunded":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  return (
    <main className="max-w-5xl mx-auto space-y-8 py-8 px-4 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and view details for all your placed orders.
          </p>
        </div>

        <Link href="/products">
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card border rounded-2xl p-12 text-center space-y-4">
          <ShoppingBag className="w-14 h-14 text-muted-foreground mx-auto opacity-40" />
          <h2 className="text-xl font-bold text-foreground">No Orders Found</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You haven't placed any orders yet. Explore our clothing collection and place your first order!
          </p>
          <Link href="/products">
            <Button className="mt-2 gap-2">
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const totalQuantity = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0
            );

            return (
              <div
                key={order._id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar */}
                <div className="bg-muted/40 p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-muted-foreground">Order ID: </span>
                      <span className="font-mono font-bold text-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Placed On: </span>
                      <span className="font-semibold text-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPaymentStatusBadgeClass(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getOrderStatusBadgeClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Purchased Products Preview */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="divide-y divide-border">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border shrink-0">
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

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-sm text-foreground">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer Summary */}
                  <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <Link href={`/orders/${order._id}`}>
                      <Button variant="default" size="sm" className="gap-2 w-full sm:w-auto">
                        <Eye className="w-4 h-4" />
                        <span>View Order</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
