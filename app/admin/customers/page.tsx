"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { UserCheck, Search, ShoppingBag, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get("/api/users");
      if (res.data.success) {
        // Filter shoppers / non-admins or all users
        setCustomers(res.data.data.filter((u: Customer) => u.role === "user"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-primary" />
          <span>Customer Directory</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registered retail customers, shopping history, and contact information.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
            Loading customer records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No customers found matching "{search}".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase font-bold">
                  <th className="py-3.5 px-6 text-left">Customer</th>
                  <th className="py-3.5 px-6 text-left">Contact Email</th>
                  <th className="py-3.5 px-6 text-left">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">Account Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((cust) => (
                  <tr key={cust._id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-sm">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{cust.name}</p>
                          <p className="text-xs text-muted-foreground">ID: #{cust._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{cust.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {new Date(cust.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-full text-xs">
                        Verified Customer
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
