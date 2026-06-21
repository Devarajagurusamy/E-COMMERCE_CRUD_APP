"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentUser, logout } from "@/lib/store/slices/authSlice";
import { AppDispatch, RootState } from "@/lib/store";

import { useRouter } from "next/navigation";

import axios from "axios";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartDrawer from "@/components/CartDrawer";
import ThemeToggle from "@/components/ThemeToggle";

import { Menu, X } from "lucide-react";

export default function Header() {

    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();

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

            router.push("/login");

            router.refresh();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <header className="sticky top-0 z-50 bg-background border-b border-border">

            <div className="max-w-7xl mx-auto px-4">

                <div className="h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold"
                    >
                        EComm
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">

                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                Home
                            </Button>
                        </Link>

                        <Link href="/products">
                            <Button variant="ghost" size="sm">
                                Products
                            </Button>
                        </Link>

                        {!isAuthenticated ? (

                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>

                        ) : (

                            <>

                                {user?.role === "admin" && (

                                    <Link href="/admin/dashboard">

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                        >
                                            Admin
                                        </Button>

                                    </Link>

                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>

                            </>

                        )}

                        <CartDrawer />

                        <ThemeToggle />

                    </nav>

                    {/* Mobile Right Section */}
                    <div className="flex items-center gap-2 md:hidden">

                        <CartDrawer />

                        <ThemeToggle />

                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                        >
                            {open ? (

                                <X className="h-6 w-6" />

                            ) : (

                                <Menu className="h-6 w-6" />

                            )}
                        </button>

                    </div>

                </div>

            </div>

            {/* Mobile Collapsible Menu */}
            {open && (

                <div className="md:hidden border-t border-border bg-background">

                    <div className="px-4 py-3 flex flex-col gap-2">

                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Home
                            </Button>
                        </Link>

                        <Link
                            href="/products"
                            onClick={() => setOpen(false)}
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Products
                            </Button>
                        </Link>

                        {!isAuthenticated ? (

                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                >
                                    Login
                                </Button>
                            </Link>

                        ) : (

                            <>

                                {user?.role === "admin" && (

                                    <Link
                                        href="/admin/dashboard"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                        >
                                            Admin
                                        </Button>
                                    </Link>

                                )}

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>

                            </>

                        )}

                    </div>

                </div>

            )}

        </header>

    );

}