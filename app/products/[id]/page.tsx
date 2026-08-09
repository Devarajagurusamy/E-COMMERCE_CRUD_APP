"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchProductById } from "@/lib/store/slices/productSlice";
import { addToCart, fetchCart } from "@/lib/store/slices/cartSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductSkeleton from "@/components/ProductSkeleton";
import axiosInstance from "@/lib/axios";
import { CreditCard, Loader2 } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct: product, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: cartLoading } = useSelector((state: RootState) => state.cart);
  const [localLoading, setLocalLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  const finalPrice = product?.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product?.price;

  const inStock = (product?.stock || 0) > 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLocalLoading(true);
    try {
      await dispatch(addToCart({ productId: product!._id, quantity: 1 })).unwrap();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCancelOrder = async (razorpayOrderId: string) => {
    try {
      await axiosInstance.post("/api/checkout/cancel", {
        razorpay_order_id: razorpayOrderId,
      });
    } catch (err) {
      console.error("Failed to update cancelled order status:", err);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      // 1. Add current item to cart first
      await dispatch(addToCart({ productId: product!._id, quantity: 1 })).unwrap();

      // 2. Create order on server
      const { data } = await axiosInstance.post("/api/checkout/create-order");

      if (!data.success) {
        setCheckoutError(data.message || "Failed to initiate order");
        setIsCheckingOut(false);
        return;
      }

      // 3. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setCheckoutError("Razorpay SDK failed to load. Are you online?");
        setIsCheckingOut(false);
        return;
      }

      // 4. Open Razorpay Modal Window
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "E-Commerce Clothing Store",
        description: "Purchase Checkout",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await axiosInstance.post("/api/checkout/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              dispatch(fetchCart());
              router.push(`/orders/success?orderId=${verifyRes.data.orderId}`);
            } else {
              setCheckoutError(
                verifyRes.data.message || "Payment verification failed"
              );
              await handleCancelOrder(data.razorpayOrderId);
            }
          } catch (err: any) {
            setCheckoutError(
              err.response?.data?.message || "Error verifying payment signature"
            );
            await handleCancelOrder(data.razorpayOrderId);
          } finally {
            setIsCheckingOut(false);
          }
        },
        modal: {
          ondismiss: async function () {
            setIsCheckingOut(false);
            await handleCancelOrder(data.razorpayOrderId);
          },
        },
        theme: {
          color: "#18181b",
        },
      };

      const razorpayWindow = new (window as any).Razorpay(options);

      razorpayWindow.on("payment.failed", async function (response: any) {
        setCheckoutError(
          response.error?.description || "Payment failed or cancelled."
        );
        await handleCancelOrder(data.razorpayOrderId);
        setIsCheckingOut(false);
      });

      razorpayWindow.open();
    } catch (error: any) {
      console.error("Checkout Error:", error);
      setCheckoutError(
        error.response?.data?.message ||
          error?.message ||
          "An error occurred during checkout."
      );
      setIsCheckingOut(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <main className="page-container">
        <ProductSkeleton />
      </main>
    );
  }

  // Error State - Product Not Found
  if (error || !product) {
    return (
      <main className="page-container">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <h1 className="text-3xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">Product not found.</p>
          <Link href="/products">
            <Button variant="default">Back to Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-12">
        {/* Left - Product Image */}
        <div className="relative">
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover w-full h-full"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg font-bold">
                {product.discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <div className="flex gap-3 flex-wrap">
              <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">
                {product.brand}
              </span>
              <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">
                {product.clothType}
              </span>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Price Section */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-foreground">
                    ₹{finalPrice || 0}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-xl line-through text-muted-foreground">
                        ₹{product.price}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        Save ₹
                        {product.price - (finalPrice || 0)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-semibold text-foreground">{product.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-semibold text-foreground">{product.color}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-semibold text-foreground">
                    {product.stock} {product.stock > 0 ? "Available" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p
                    className={`font-semibold ${
                      inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {inStock ? "✓ In Stock" : "✗ Out of Stock"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              disabled={!inStock || cartLoading || localLoading || isCheckingOut}
              className="flex-1"
              variant="outline"
              onClick={handleAddToCart}
            >
              {localLoading ? "Adding..." : inStock ? "Add to Cart" : "Unavailable"}
            </Button>
            <Button
              size="lg"
              disabled={!inStock || cartLoading || localLoading || isCheckingOut}
              className="flex-1 gap-2"
              variant="default"
              onClick={handleProceedToCheckout}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed To Checkout</span>
                </>
              )}
            </Button>
          </div>

          {checkoutError && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
              {checkoutError}
            </div>
          )}

          {/* Additional Info */}
          {!inStock && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                This product is currently out of stock. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

