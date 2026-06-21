"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCartItems: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalCartItems: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/stats");

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        Loading...
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 className="section-title mb-6">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="card-container p-6">
          <h2 className="text-muted-foreground">
            Total Users
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.totalUsers}
          </p>
        </div>

        <div className="card-container p-6">
          <h2 className="text-muted-foreground">
            Total Products
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.totalProducts}
          </p>
        </div>

        <div className="card-container p-6">
          <h2 className="text-muted-foreground">
            Total Cart Items
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.totalCartItems}
          </p>
        </div>

      </div>
    </main>
  );
}