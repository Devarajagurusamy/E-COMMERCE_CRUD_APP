export default function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 py-10">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold tracking-tight">
                            E-Commerce
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            A modern e-commerce platform built with Next.js, MongoDB,
                            Redux Toolkit, and Tailwind CSS.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-semibold mb-4">
                            Shop
                        </h3>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="/products" className="hover:text-foreground transition-colors">
                                    Products
                                </a>
                            </li>

                            <li>
                                <a href="/cart" className="hover:text-foreground transition-colors">
                                    Cart
                                </a>
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
                                <a href="/login" className="hover:text-foreground transition-colors">
                                    Login
                                </a>
                            </li>

                            <li>
                                <a href="/register" className="hover:text-foreground transition-colors">
                                    Register
                                </a>
                            </li>
                        </ul>
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

                    <p className="text-sm text-muted-foreground">
                        Built by Devaraja
                    </p>

                </div>

            </div>
        </footer>
    );
}