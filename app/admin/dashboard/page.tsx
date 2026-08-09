"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchCurrentUser } from "@/lib/store/slices/authSlice";

import {
  RevenueProfitChart,
  SalesBarChart,
  OrderStatusDonutChart,
} from "@/components/admin/DashboardCharts";

import {
  HeroBanner,
  KpiCards,
  BestSellersWidget,
  LowStockAlertWidget,
  RecentOrdersWidget,
  RecentCustomersWidget,
  QuickActionsWidget,
} from "@/components/admin/DashboardWidgets";

import { RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [period, setPeriod] = useState("30d");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Check
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

  // Fetch Current User
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  // Fetch Dashboard Data on Period Change
  const fetchDashboardData = async (selectedPeriod: string = period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(
        `/api/admin/dashboard?period=${selectedPeriod}`
      );
      if (res.data.success) {
        setDashboardData(res.data.data);
      } else {
        setError(res.data.message || "Failed to load dashboard statistics");
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to connect to admin dashboard service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  // Skeleton Loading State
  if (loading && !dashboardData) {
    return (
      <div className="space-y-8 animate-pulse p-2">
        <div className="h-40 bg-muted/60 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/60 rounded-3xl" />
          ))}
        </div>
        <div className="h-80 bg-muted/60 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-72 bg-muted/60 rounded-3xl" />
          <div className="h-72 bg-muted/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error && !dashboardData) {
    return (
      <div className="bg-card border border-destructive/30 rounded-3xl p-8 text-center space-y-4 max-w-md mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Unable to load Dashboard</h2>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={() => fetchDashboardData(period)} className="gap-2 rounded-2xl">
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </Button>
      </div>
    );
  }

  const {
    metrics,
    timeSeriesData,
    orderStatusDistribution,
    bestSellers,
    lowStockProducts,
    recentOrders,
    recentCustomers,
  } = dashboardData || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Overview Banner */}
      <HeroBanner user={user} />

      {/* KPI Cards Grid */}
      {metrics && <KpiCards metrics={metrics} />}

      {/* Quick Actions Bar */}
      <QuickActionsWidget />

      {/* Large Revenue & Profit Line Chart */}
      <RevenueProfitChart
        data={timeSeriesData || []}
        period={period}
        onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
      />

      {/* Two Column Layout for Supporting Analytics & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Sales Volume Bar Chart */}
          <SalesBarChart data={timeSeriesData || []} />

          {/* Best Selling Products */}
          <BestSellersWidget bestSellers={bestSellers || []} />

          {/* Recent Customer Orders */}
          <RecentOrdersWidget orders={recentOrders || []} />
        </div>

        {/* Right Column (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Order Status Donut Chart */}
          <OrderStatusDonutChart distribution={orderStatusDistribution || {}} />

          {/* Low Stock Alerts */}
          <LowStockAlertWidget lowStock={lowStockProducts || []} />

          {/* Recent Customer Registrations */}
          <RecentCustomersWidget customers={recentCustomers || []} />
        </div>
      </div>
    </div>
  );
}