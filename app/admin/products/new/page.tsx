"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { createProduct } from "@/lib/store/slices/productSlice";

export default function AddProductPage() {
    const router = useRouter();

    const dispatch = useDispatch<any>();

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

            <h1 className="text-4xl font-bold mb-8">
                Add Product
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    rows={4}
                    required
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="number"
                    name="discount"
                    placeholder="Discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />

                <input
                    type="text"
                    name="clothType"
                    placeholder="Cloth Type"
                    value={formData.clothType}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="text"
                    name="brand"
                    placeholder="Brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="text"
                    name="size"
                    placeholder="Size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />

                <button
                    type="submit"
                    className="px-6 py-3 border rounded"
                >
                    Add Product
                </button>

            </form>

        </main>
    );
}