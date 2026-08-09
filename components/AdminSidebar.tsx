"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import { LogOut } from "lucide-react";

const links = [
    {
        name: "Dashboard",
        href: "/admin/dashboard",
    },

    {
        name: "Products",
        href: "/admin/products",
    },

    {
        name: "Orders",
        href: "/admin/orders",
    },

    {
        name: "Users",
        href: "/admin/users",
    },
];

export default function AdminSidebar() {
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

    return (
        <aside className="w-64 h-screen sticky top-0 flex flex-col border-r border-border bg-card">
            <div>
                <div className="p-6 text-2xl font-bold text-foreground">
                    Admin Panel
                </div>

                <nav className="space-y-2 px-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                  block
                  rounded-lg
                  px-4
                  py-3
                  transition-colors

                  ${pathname === link.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                }
                `}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-border mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}