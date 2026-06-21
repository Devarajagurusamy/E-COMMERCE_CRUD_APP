"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        name: "Users",
        href: "/admin/users",
    },
];

export default function AdminSidebar() {

    const pathname = usePathname();

    return (

        <aside className="w-64 min-h-screen border-r border-border bg-card">

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

        </aside>

    );

}