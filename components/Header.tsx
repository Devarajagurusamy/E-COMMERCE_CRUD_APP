"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logout } from "@/lib/store/slices/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, ShoppingBag, X, User, LogOut } from "lucide-react";

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const { user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
            dispatch(logout());
            setOpen(false);
            window.location.href = "/";
        } catch (error) {
            console.error(error);
        }
    };

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Categories", href: "/#categories" },
        { label: "Products", href: "/products" },
        { label: "Reviews", href: "/#reviews" },
        ...(isAuthenticated
            ? [
                { label: "My Orders", href: "/orders" },
                ...(user?.role === "admin"
                    ? [{ label: "Admin", href: "/admin/dashboard" }]
                    : []),
            ]
            : []),
    ];

    const isActive = (href: string) => {
        if (href.includes("#")) return false;
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between gap-4">
                    {/* Brand Logo & Name */}
                    <div className="flex items-center shrink-0">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
                        >
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <span className="font-bold tracking-tight">EComm</span>
                        </Link>
                    </div>

                    {/* Centered Desktop Navigation */}
                    <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-3 flex-1 max-w-2xl">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${active
                                        ? "text-foreground font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />

                        <CartDrawer />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 pl-2 border-l border-border">
                                <Link href="/profile">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-sm font-medium text-foreground hover:bg-muted"
                                    >
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="max-w-[100px] truncate">
                                            {user?.name || "Profile"}
                                        </span>
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    title="Logout"
                                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="gap-2 font-medium px-4">
                                    <User className="h-4 w-4" />
                                    <span>Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Right Bar Actions */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <CartDrawer />
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                            className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors border border-border"
                        >
                            {open ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Collapsible Navigation Menu */}
            {open && (
                <div className="md:hidden border-t border-border bg-background/98 backdrop-blur animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 flex flex-col space-y-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${active
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}

                        <div className="pt-2 mt-2 border-t border-border flex flex-col space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/profile"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-foreground hover:bg-muted transition-colors"
                                    >
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <span>Profile ({user?.name})</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    <User className="h-5 w-5" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
