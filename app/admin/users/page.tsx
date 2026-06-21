"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/users");

      if (response.data.success) {
        setUsers(response.data.data);
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
        Loading...
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        User Management
      </h1>

      <div className="overflow-x-auto border rounded-lg">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-b"
              >

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">

                  <span
                    className={
                      user.role === "admin"
                        ? "font-semibold"
                        : ""
                    }
                  >
                    {user.role}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}