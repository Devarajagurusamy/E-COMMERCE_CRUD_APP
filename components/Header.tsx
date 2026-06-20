"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "@/lib/store/slices/authSlice";
import { AppDispatch } from "@/lib/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <header className="bg-background border-b border-border sticky top-0 z-30">
            <div className="page-container flex items-center justify-between h-16 px-4">
                <Link href="/" className="text-2xl font-bold">
                    EComm
                </Link>

                <nav className="flex items-center gap-4">
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
                    <Link href="/login">
                        <Button variant="ghost" size="sm">
                            Login
                        </Button>
                    </Link>
                    <CartDrawer />
                </nav>
            </div>
        </header>
    );
}
