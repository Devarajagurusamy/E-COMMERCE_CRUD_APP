"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Users, Package } from "lucide-react";

import { fetchProducts } from "@/lib/store/slices/productSlice";

interface Stats {
  totalUsers: number;
  totalProducts: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const { products } = useSelector(
    (state: any) => state.products
  );

  // Admin check

  useEffect(() => {

    const checkAdmin = async () => {

      try {

        const res = await axios.get("/api/auth/me");

        if (!res.data.success) {
          router.push("/login");
          return;
        }

        if (res.data.user.role !== "admin") {
          router.push("/");
        }

      } catch {

        router.push("/login");

      }

    };

    checkAdmin();

  }, [router]);

  // Fetch dashboard data

  useEffect(() => {

    fetchDashboard();

    dispatch(fetchProducts());

  }, [dispatch]);

  const fetchDashboard = async () => {

    try {

      const [statsRes, usersRes] = await Promise.all([
        axiosInstance.get("/api/admin/stats"),
        axiosInstance.get("/api/users"),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <main className="max-w-7xl mx-auto px-6 py-10">

        <p>Loading...</p>

      </main>

    );

  }

  return (

    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="group relative overflow-hidden bg-card rounded-2xl border p-8 hover:scale-[1.02] hover:shadow-2xl">

          <div className="flex justify-between items-start">

            <div>

              <p>
                Total Users
              </p>

              <h2 className="text-5xl font-bold mt-4">
                {stats.totalUsers}
              </h2>

              <p className="mt-4 text-sm">
                Registered users
              </p>

            </div>


            <div className="mt-2 bg-muted/20 p-4 rounded-2xl">

              <Users size={34} />

            </div>

          </div>

        </div>


        

        <div className="group relative overflow-hidden bg-card rounded-2xl border p-8 hover:scale-[1.02] hover:shadow-2xl">

          <div className="flex justify-between items-start">

            <div>

              <p>
                Total Products
              </p>

              <h2 className="text-5xl font-bold mt-4">
                {stats.totalProducts}
              </h2>

              <p className="mt-4 text-sm text-purple-100">
                Available products
              </p>

            </div>


            <div className="mt-2 bg-muted/20 p-4 rounded-2xl">

              <Package size={34} />

            </div>

          </div>

        </div>

      </div>


      {/* Tables */}

      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">

        {/* Products */}

        <div className="xl:col-span-7">

          <div className="rounded-2xl border overflow-hidden bg-card shadow-sm">

            <div className="px-6 py-5 border-b">

              <h2 className="text-2xl font-semibold">

                Products

              </h2>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b bg-muted/50">

                    <th className="text-left p-4">
                      Image
                    </th>

                    <th className="text-left p-4">
                      Title
                    </th>

                    <th className="text-left p-4">
                      Price
                    </th>

                    <th className="text-left p-4">
                      Brand
                    </th>

                    <th className="text-left p-4">
                      Stock
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product: any) => (

                    <tr
                      key={product._id}
                      className="border-b hover:bg-muted/30 transition"
                    >

                      <td className="p-4">

                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-14 h-14 rounded-lg object-cover"
                        />

                      </td>

                      <td className="p-4 font-medium">

                        {product.title}

                      </td>

                      <td className="p-4">

                        ₹{product.price}

                      </td>

                      <td className="p-4">

                        {product.brand}

                      </td>

                      <td className="p-4">

                        {product.stock}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>


        {/* Users */}

        <div className="xl:col-span-3">

          <div className="rounded-2xl border overflow-hidden bg-card shadow-sm h-full">

            <div className="px-6 py-5 border-b">

              <h2 className="text-2xl font-semibold">

                Users

              </h2>

            </div>


            <div className="overflow-y-auto max-h-[700px]">

              <table className="w-full">

                <thead>

                  <tr className="border-b bg-muted/50">

                    <th className="text-left p-4">

                      User

                    </th>

                    <th className="text-left p-4">

                      Role

                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr
                      key={user._id}
                      className="border-b hover:bg-muted/30 transition"
                    >

                      <td className="p-4">

                        <div>

                          <p className="font-medium">

                            {user.name}

                          </p>

                          <p className="text-sm text-muted-foreground truncate">

                            {user.email}

                          </p>

                        </div>

                      </td>

                      <td className="p-4">

                        <span
                          className={`text-sm px-2 py-1 rounded-md ${user.role === "admin"
                              ? "bg-black text-white"
                              : "bg-muted"
                            }`}
                        >

                          {user.role}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </main>

  );

}