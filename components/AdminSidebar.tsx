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

        <aside className="w-64 min-h-screen border-r bg-white">

            <div className="p-6 text-2xl font-bold">
                Admin Panel
            </div>

            <nav className="space-y-2 px-4">

                {links.map((link) => (

                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-lg px-4 py-3

              ${pathname === link.href

                                ? "bg-black text-white"

                                : "hover:bg-gray-100"

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