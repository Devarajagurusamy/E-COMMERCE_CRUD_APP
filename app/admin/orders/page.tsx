"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  CheckCheck,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  Calendar,
  RefreshCw,
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
  razorpayPaymentId?: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
}

const ORDER_STATUS_OPTIONS = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

const PAYMENT_STATUS_OPTIONS = ["All", "Pending", "Paid", "Failed", "Refunded"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    refundedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Admin Verification
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        if (!res.data.success) {
          router.push("/login");
          return;
        }
        if (res.data.user.role !== "admin") {
          router.push("/");
        }
      } catch {
        router.push("/login");
      }
    };

    checkAdmin();
  }, [router]);

  // Fetch Orders & Stats
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (orderStatusFilter !== "All") params.append("orderStatus", orderStatusFilter);
      if (paymentStatusFilter !== "All") params.append("paymentStatus", paymentStatusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("sort", sortOrder);

      const res = await axiosInstance.get(`/api/admin/orders?${params.toString()}`);
      if (res.data.success) {
        setOrders(res.data.orders);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderStatusFilter, paymentStatusFilter, startDate, endDate, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await axiosInstance.patch(`/api/admin/orders/${orderId}`, {
        orderStatus: newStatus,
      });

      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setOrderStatusFilter("All");
    setPaymentStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setSortOrder("newest");
  };

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

  return (
    <main className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customer Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track, process, and manage customer orders across all order stages.
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          className="w-fit gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </Button>
      </div>

      {/* Order Status Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-xs font-medium">Total</span>
            <ShoppingBag className="w-4 h-4 text-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-amber-600">
            <span className="text-xs font-medium">Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-amber-600">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-blue-600">
            <span className="text-xs font-medium">Confirmed</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-blue-600">
            {stats.confirmedOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-purple-600">
            <span className="text-xs font-medium">Processing</span>
            <PackageCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-purple-600">
            {stats.processingOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-indigo-600">
            <span className="text-xs font-medium">Shipped</span>
            <Truck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-indigo-600">
            {stats.shippedOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-medium">Delivered</span>
            <CheckCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-600">
            {stats.deliveredOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-red-600">
            <span className="text-xs font-medium">Cancelled</span>
            <XCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-red-600">
            {stats.cancelledOrders}
          </p>
        </div>

        <div className="bg-card border rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-xs font-medium">Refunded</span>
            <RotateCcw className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold mt-2 text-slate-600">
            {stats.refundedOrders}
          </p>
        </div>
      </div>

      {/* Filter and Toolbar Section */}
      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col lg:flex-row gap-3"
        >
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID, customer name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button type="submit" size="sm" className="gap-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
          {/* Order Status Filter */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Order Status
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground"
            >
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Order Statuses" : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Payment Status
            </label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground"
            >
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Payment Statuses" : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          {/* Sort Order Selector */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Sort Date
            </label>
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "oldest")
              }
              className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-background text-foreground"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Orders List ({orders.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
            <p className="text-muted-foreground text-sm">
              No orders found matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground text-xs uppercase font-medium">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-center py-3 px-4">Items</th>
                  <th className="text-right py-3 px-4">Total Amount</th>
                  <th className="text-center py-3 px-4">Payment</th>
                  <th className="text-center py-3 px-4">Order Status</th>
                  <th className="text-left py-3 px-4">Order Date</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  );

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="py-3 px-4 font-mono text-xs font-semibold">
                        <span className="text-foreground">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {order.razorpayOrderId}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">
                          {order.customerDetails?.name || "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {order.customerDetails?.email}
                        </p>
                      </td>

                      {/* Items Count */}
                      <td className="py-3 px-4 text-center font-semibold">
                        {totalItems}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-4 text-right font-bold text-foreground">
                        ₹{order.totalAmount}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getPaymentStatusBadgeClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Order Status Control */}
                      <td className="py-3 px-4 text-center">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            handleQuickStatusUpdate(order._id, e.target.value)
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg border focus:outline-none cursor-pointer ${getOrderStatusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {ORDER_STATUS_OPTIONS.filter((o) => o !== "All").map(
                            (st) => (
                              <option key={st} value={st} className="bg-card text-foreground">
                                {st}
                              </option>
                            )
                          )}
                        </select>
                      </td>

                      {/* Order Date */}
                      <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
