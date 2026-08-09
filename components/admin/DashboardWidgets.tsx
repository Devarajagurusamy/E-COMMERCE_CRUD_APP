"use client";

import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Eye,
  PlusCircle,
  BarChart2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: string;
  totalProfit: number;
  profitGrowth: string;
  totalOrders: number;
  ordersGrowth: string;
  totalSales: number;
  salesGrowth: string;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
}

// 1. HERO BANNER
export function HeroBanner({ user }: { user: any }) {
  return (
    <div className="relative overflow-hidden bg-zinc-950 text-white rounded-3xl p-6 lg:p-8 shadow-2xl border border-zinc-800">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-xs font-medium border border-zinc-700">
            {/* <Sparkles className="w-3.5 h-3.5 text-amber-400" /> */}
            <span>Store Performance Active</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name || "Devaraja"} 
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Here is your real-time e-commerce operational snapshot. Track your store sales, profits, order pipelines, and inventory alerts in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new">
            <Button size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold gap-2 rounded-2xl">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button size="sm" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900 font-semibold gap-2 rounded-2xl">
              <ShoppingBag className="w-4 h-4" />
              <span>Manage Orders</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 2. KPI CARDS GRID
export function KpiCards({ metrics }: { metrics: DashboardMetrics }) {
  const cards = [
    {
      title: "TOTAL REVENUE",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      trend: `${metrics.revenueGrowth}% from prev period`,
      isUp: !metrics.revenueGrowth.startsWith("-"),
      icon: DollarSign,
      iconBg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "TOTAL PROFIT",
      value: `₹${metrics.totalProfit.toLocaleString()}`,
      trend: `${metrics.profitGrowth}% net margin`,
      isUp: !metrics.profitGrowth.startsWith("-"),
      icon: TrendingUp,
      iconBg: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "TOTAL ORDERS",
      value: metrics.totalOrders.toLocaleString(),
      trend: `${metrics.ordersGrowth}% order growth`,
      isUp: !metrics.ordersGrowth.startsWith("-"),
      icon: ShoppingBag,
      iconBg: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "TOTAL SALES (UNITS)",
      value: metrics.totalSales.toLocaleString(),
      trend: `${metrics.salesGrowth}% sales volume`,
      isUp: !metrics.salesGrowth.startsWith("-"),
      icon: Package,
      iconBg: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "TOTAL CUSTOMERS",
      value: metrics.totalCustomers.toLocaleString(),
      trend: "Registered shoppers",
      isUp: true,
      icon: Users,
      iconBg: "bg-teal-500/10 text-teal-500",
    },
    {
      title: "TOTAL PRODUCTS",
      value: metrics.totalProducts.toLocaleString(),
      trend: "Catalog count",
      isUp: true,
      icon: Package,
      iconBg: "bg-sky-500/10 text-sky-500",
    },
    {
      title: "PENDING ORDERS",
      value: metrics.pendingOrders.toLocaleString(),
      trend: "Needs processing",
      isUp: metrics.pendingOrders === 0,
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "LOW STOCK ALERT",
      value: metrics.lowStockCount.toLocaleString(),
      trend: "Stock <= 5 units",
      isUp: metrics.lowStockCount === 0,
      icon: AlertTriangle,
      iconBg: "bg-red-500/10 text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-card border border-border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                {card.title}
              </span>
              <div className={`p-3 rounded-2xl ${card.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <h2 className="text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                {card.value}
              </h2>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <span className={card.isUp ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
                  {card.isUp ? "↑" : "↓"} {card.trend}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 3. BEST SELLERS WIDGET
export function BestSellersWidget({ bestSellers }: { bestSellers: any[] }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-lg font-bold text-foreground">Best Selling Products</h3>
        <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {bestSellers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No product sales data yet.</p>
        ) : (
          bestSellers.map((item, i) => (
            <div key={item.id || i} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-bold text-xs">
                    PROD
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sales} sold • Stock: {item.stock} left
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-foreground block">
                  ₹{(item.revenue || item.price * item.sales).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Popular
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 4. LOW STOCK ALERT WIDGET
export function LowStockAlertWidget({ lowStock }: { lowStock: any[] }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-foreground">Inventory Alerts</h3>
        </div>
        <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <span>Restock Catalog</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {lowStock.length === 0 ? (
          <div className="p-4 text-center text-xs text-emerald-600 font-medium bg-emerald-500/10 rounded-2xl">
            ✓ All inventory levels are healthy! No low stock alerts.
          </div>
        ) : (
          lowStock.map((p) => (
            <div key={p._id} className="flex items-center justify-between p-3 border border-red-500/20 bg-red-500/5 rounded-2xl">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground truncate max-w-[180px]">{p.title}</p>
                  <p className="text-xs text-red-600 font-bold">Only {p.stock} item(s) left</p>
                </div>
              </div>
              <Link href={`/admin/products/${p._id}/edit`}>
                <Button size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                  Update Stock
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 5. RECENT ORDERS WIDGET
export function RecentOrdersWidget({ orders }: { orders: any[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-lg font-bold text-foreground">Recent Customer Orders</h3>
        <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <span>View All Orders</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left uppercase font-semibold">
              <th className="py-2.5 px-3">Order ID</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3 text-right">Total</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-muted-foreground">
                  No orders recorded yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-foreground">{o.customerDetails?.name || "Customer"}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{o.customerDetails?.email}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-foreground">
                    ₹{o.totalAmount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusBadge(o.orderStatus)}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link href={`/admin/orders/${o._id}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1">
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. RECENT CUSTOMERS WIDGET
export function RecentCustomersWidget({ customers }: { customers: any[] }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-lg font-bold text-foreground">Recent Customer Registrations</h3>
        <Link href="/admin/customers" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <span>View All Customers</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {customers.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No recent customer registrations.</p>
        ) : (
          customers.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
                  {c.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[160px]">{c.email}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-foreground block">
                  ₹{c.totalSpent.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {c.ordersCount} order(s)
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 7. QUICK ACTIONS BAR
export function QuickActionsWidget() {
  const actions = [
    { label: "Create Product", href: "/admin/products/new", icon: PlusCircle, bg: "bg-blue-500/10 text-blue-600" },
    { label: "Manage Orders", href: "/admin/orders", icon: ShoppingBag, bg: "bg-emerald-500/10 text-emerald-600" },
    { label: "Manage Users", href: "/admin/users", icon: Users, bg: "bg-purple-500/10 text-purple-600" },
    { label: "Sales Analytics", href: "/admin/analytics", icon: BarChart2, bg: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-foreground tracking-wider uppercase">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link
              key={idx}
              href={act.href}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-border hover:bg-accent transition-all group"
            >
              <div className={`p-2.5 rounded-xl ${act.bg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
