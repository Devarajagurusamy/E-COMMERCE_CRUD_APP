"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchProductById,
    updateProduct,
} from "@/lib/store/slices/productSlice";

import axios from "axios";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id as string;

    const dispatch = useDispatch<any>();

    const { selectedProduct, loading } = useSelector(
        (state: any) => state.products
    );

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

    // Check admin

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

    // Fetch product

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    // Prefill form

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                title: selectedProduct.title,
                description: selectedProduct.description,
                price: selectedProduct.price,
                discount: selectedProduct.discount,
                clothType: selectedProduct.clothType,
                brand: selectedProduct.brand,
                size: selectedProduct.size,
                color: selectedProduct.color,
                stock: selectedProduct.stock,
                image: selectedProduct.image,
            });
        }
    }, [selectedProduct]);

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
                updateProduct({
                    id,
                    data: formData,
                })
            ).unwrap();

            alert("Product updated successfully");

            router.push("/admin/products");
        } catch (error: any) {
            alert(error || "Failed to update product");
        }
    };

    if (loading && !selectedProduct) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-10">
                Loading product...
            </div>
        );
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold mb-8">
                Edit Product
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
                    Update Product
                </button>

            </form>

        </main>
    );
}