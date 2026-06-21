"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { createProduct } from "@/lib/store/slices/productSlice";

import axios from "axios";

export default function AddProductPage() {
    const router = useRouter();

    const dispatch = useDispatch<any>();

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

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        discount: 0,
        clothType: "",
        brand: "",
        size: "",
        color: "",
        stock: 0,
        image: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        setFormData({
            ...formData,

            [e.target.name]:
                e.target.type === "number"
                    ? Number(e.target.value)
                    : e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await dispatch(
                createProduct(formData)
            ).unwrap();

            alert("Product created successfully");

            router.push("/admin/products");
        } catch (error: any) {
            alert(error || "Failed to create product");
        }
    };

    return (
        <main className="max-w-3xl mx-auto px-6 py-10">

            <h1 className="text-5xl font-bold mb-10">
                Add Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Title */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Product Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        placeholder="Enter product title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        required
                    />
                </div>

                {/* Description */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Description
                    </label>

                    <textarea
                        name="description"
                        placeholder="Write product description..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition resize-none"
                        required
                    />
                </div>

                {/* Price & Discount */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-2 text-sm font-medium text-stone-300">
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            placeholder="Enter product price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-stone-300">
                            Discount (%)
                        </label>

                        <input
                            type="number"
                            name="discount"
                            placeholder="Example: 10"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        />
                    </div>

                </div>

                {/* Cloth Type */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Cloth Type
                    </label>

                    <input
                        type="text"
                        name="clothType"
                        placeholder="T-Shirt, Shirt, Hoodie..."
                        value={formData.clothType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        required
                    />
                </div>

                {/* Brand */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Brand
                    </label>

                    <input
                        type="text"
                        name="brand"
                        placeholder="Enter brand name"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        required
                    />
                </div>

                {/* Size & Color */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-2 text-sm font-medium text-stone-300">
                            Size
                        </label>

                        <input
                            type="text"
                            name="size"
                            placeholder="S, M, L, XL"
                            value={formData.size}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-stone-300">
                            Color
                        </label>

                        <input
                            type="text"
                            name="color"
                            placeholder="Black"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                            required
                        />
                    </div>

                </div>

                {/* Stock */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Stock Quantity
                    </label>

                    <input
                        type="number"
                        name="stock"
                        placeholder="Available quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        required
                    />
                </div>

                {/* Image URL */}

                <div>
                    <label className="block mb-2 text-sm font-medium text-stone-300">
                        Image URL
                    </label>

                    <input
                        type="text"
                        name="image"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-stone-800 bg-black px-4 py-3 text-white placeholder:text-stone-500 outline-none focus:border-white transition"
                        required
                    />
                </div>

                {/* Submit Button */}

                <button
                    type="submit"
                    className="
          w-full
          border
          border-white
          rounded-lg
          py-3
          text-sm
          font-semibold
          uppercase
          tracking-widest
          hover:bg-white
          hover:text-black
          transition-all
          duration-300
          "
                >
                    Add Product
                </button>

            </form>

        </main>
    );
}