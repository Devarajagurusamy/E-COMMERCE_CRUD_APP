import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-center lg:text-left">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start">
                        <h2 className="text-2xl font-bold">
                            E-Commerce
                        </h2>

                        <p className="mt-3 text-sm text-muted-foreground leading-7 max-w-xs">
                            A modern e-commerce platform built with Next.js,
                            MongoDB, Redux Toolkit, and Tailwind CSS.
                        </p>
                    </div>

                    {/* Shop */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-semibold mb-4">
                            Shop
                        </h3>

                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/cart"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-semibold mb-4">
                            Account
                        </h3>

                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/login"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/register"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Demo Admin */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-semibold mb-4">
                            Demo Admin
                        </h3>

                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                <span className="font-medium text-foreground">
                                    Email:
                                </span>{" "}
                                admin@gmail.com
                            </p>

                            <p>
                                <span className="font-medium text-foreground">
                                    Password:
                                </span>{" "}
                                123456
                            </p>
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-col items-center lg:items-start">
                        <h3 className="font-semibold mb-4">
                            Built With
                        </h3>

                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>Next.js 16</li>
                            <li>MongoDB Atlas</li>
                            <li>Redux Toolkit</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-center">

                    <p className="text-sm text-muted-foreground">
                        © 2026 E-Commerce CRUD App. All rights reserved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">

                        <span className="text-sm text-muted-foreground">
                            Built by Devaraja
                        </span>

                        <a
                            href="https://www.linkedin.com/in/devaraja-s-g/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                        >
                            LinkedIn →
                        </a>

                    </div>

                </div>

            </div>
        </footer>
    );
}