"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { RevenueProfitChart, SalesBarChart, OrderStatusDonutChart } from "@/components/admin/DashboardCharts";
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (selectedPeriod: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/admin/dashboard?period=${selectedPeriod}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  if (loading && !data) {
    return <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading Analytics Data...</div>;
  }

  const { metrics, timeSeriesData, orderStatusDistribution, categoryPerformance } = data || {};

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <span>E-Commerce Business Analytics</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          In-depth breakdown of gross revenues, net profit, category sales, and order velocity.
        </p>
      </div>

      {/* Analytics Summary Bar */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase">Gross Sales Revenue</span>
            <h2 className="text-3xl font-black text-foreground mt-2">₹{metrics.totalRevenue.toLocaleString()}</h2>
            <p className="text-xs text-emerald-500 font-bold mt-1">↑ {metrics.revenueGrowth}% growth</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase">Estimated Net Profit</span>
            <h2 className="text-3xl font-black text-foreground mt-2">₹{metrics.totalProfit.toLocaleString()}</h2>
            <p className="text-xs text-indigo-500 font-bold mt-1">35% average net margin</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-bold text-muted-foreground uppercase">Units Sold</span>
            <h2 className="text-3xl font-black text-foreground mt-2">{metrics.totalSales.toLocaleString()}</h2>
            <p className="text-xs text-purple-500 font-bold mt-1">Across all product lines</p>
          </div>
        </div>
      )}

      {/* Main Revenue Chart */}
      <RevenueProfitChart
        data={timeSeriesData || []}
        period={period}
        onPeriodChange={(p) => setPeriod(p)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesBarChart data={timeSeriesData || []} />
        <OrderStatusDonutChart distribution={orderStatusDistribution || {}} />
      </div>

      {/* Category Performance Breakdown */}
      {categoryPerformance && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-foreground">Performance by Clothing Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryPerformance.map((cat: any) => (
              <div key={cat.category} className="p-4 rounded-2xl bg-muted/30 border border-border/60">
                <span className="text-xs font-bold text-muted-foreground uppercase">{cat.category}</span>
                <p className="text-xl font-bold text-foreground mt-1">₹{cat.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.sales} units sold</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
