"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Store,
} from "lucide-react";

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navLinks = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: UserCheck,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      dispatch(logout());
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-zinc-950 text-zinc-100 p-4 lg:p-6 shadow-2xl select-none">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-3 py-2 mb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg">
              {/* <Store className="w-5 h-5 text-zinc-950" /> */}
              <ShoppingBag className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block text-white">
                EComm
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase block">
                ADMIN PANEL
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold shadow-inner ring-1 ring-zinc-700"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "text-white scale-110" : "text-zinc-400"
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Support & Logout Footer */}
      <div className="pt-6 border-t border-zinc-800/80 space-y-1.5">
        {/* <Link
          href="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/80 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-zinc-400" />
          <span>Support & Help</span>
        </Link> */}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-2xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}