"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Settings, Shield, User, Store, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          <span>Admin Settings & Account Preferences</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage administrator profile, store configurations, and system security controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Administrator Info Card */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Administrator Account</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Full Name</span>
              <p className="font-bold text-foreground mt-0.5">{user?.name || "Devaraja"}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Email Address</span>
              <p className="font-medium text-foreground mt-0.5">{user?.email || "admin@example.com"}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase">Assigned Role</span>
              <p className="inline-block px-2.5 py-0.5 mt-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Store Profile Settings */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">E-Commerce Store Information</h3>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Store Name</label>
                <input
                  type="text"
                  defaultValue="E-Commerce Clothes OS"
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Support Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹)"
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-xl bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full max-w-xs px-4 py-2 border border-border rounded-xl bg-background text-foreground"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Products with stock equal to or less than this value generate an active inventory alert.
              </p>
            </div>

            <Button type="button" className="rounded-2xl font-bold">
              Save Settings
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
