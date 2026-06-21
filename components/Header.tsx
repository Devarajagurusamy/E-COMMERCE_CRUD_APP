"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCurrentUser, logout } from "@/lib/store/slices/authSlice";
import { AppDispatch, RootState } from "@/lib/store";

import { useRouter } from "next/navigation";

import axios from "axios";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import CartDrawer from "@/components/CartDrawer";

import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {

    const dispatch = useDispatch<AppDispatch>();

    const router = useRouter();

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

            router.push("/login");

            router.refresh();

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <header className="bg-background border-b border-border sticky top-0 z-30">

            <div className="page-container flex items-center justify-between h-16 px-4">

                <Link
                    href="/"
                    className="text-2xl font-bold"
                >
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
                                
                                <CartDrawer />

                                <ThemeToggle />

                        </>

                    )}

                </nav>

            </div>

        </header>

    );
}