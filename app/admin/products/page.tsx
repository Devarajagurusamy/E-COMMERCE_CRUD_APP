"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  deleteProduct,
} from "@/lib/store/slices/productSlice";

import { useRouter } from "next/navigation";
import axios from "axios";


export default function AdminProductsPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();

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

  const { products, loading, error } = useSelector(
    (state: any) => state.products
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();

      alert("Product deleted successfully");
    } catch (error: any) {
      alert(error || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const keyword = search.toLowerCase();

    return (
      product.title.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword) ||
      product.clothType.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          Product Management
        </h1>

        <button className="px-4 py-2 rounded-md border hover:bg-gray-100" onClick={() => router.push("/admin/products/new")}>
          Add Product
        </button>

      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search by title, brand or cloth type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-md p-3 mb-6"
      />

      {/* Loading */}

      {loading && (
        <p>Loading products...</p>
      )}

      {/* Error */}

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {/* Empty */}

      {!loading && filteredProducts.length === 0 && (
        <p>No Products Found</p>
      )}

      {/* Table */}

      {!loading && filteredProducts.length > 0 && (

        <div className="overflow-x-auto border rounded-lg">

          <table className="w-full">

            <thead>

              <tr className="border-b bg-gray-50">

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

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((product: any) => (

                <tr
                  key={product._id}
                  className="border-b"
                >

                  <td className="p-4">

                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-16 w-16 rounded object-cover"
                    />

                  </td>

                  <td className="p-4">
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

                  <td className="p-4 space-x-2">

                    <button
                      onClick={() =>
                        router.push(`/admin/products/${product._id}/edit`)
                      }
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 border rounded text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </main>
  );
}