import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 py-10">

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    {/* Brand */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold tracking-tight">
                            E-Commerce
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A modern e-commerce platform built with Next.js,
                            MongoDB, Redux Toolkit, and Tailwind CSS.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            Shop
                        </h3>

                        <ul className="space-y-2 text-sm text-muted-foreground">
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
                    <div>
                        <h3 className="font-semibold mb-4">
                            Account
                        </h3>

                        <ul className="space-y-2 text-sm text-muted-foreground">
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

                    {/* Demo Credentials */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            Demo Admin
                        </h3>

                        <div className="space-y-2 text-sm text-muted-foreground">
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
                    <div>
                        <h3 className="font-semibold mb-4">
                            Built With
                        </h3>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Next.js 16</li>
                            <li>MongoDB Atlas</li>
                            <li>Redux Toolkit</li>
                            <li>Tailwind CSS</li>
                        </ul>
                    </div>

                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">

                    <p className="text-sm text-muted-foreground">
                        © 2026 E-Commerce CRUD App. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
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