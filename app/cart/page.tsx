"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCart, updateCartQuantity, removeFromCart } from "@/lib/store/slices/cartSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, totalItems, totalPrice, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    dispatch(fetchCart());
  }, [isAuthenticated, dispatch, router]);

  const handleIncrease = (productId: string) => {
    const item = items.find((item) => item.product._id === productId);
    if (item) {
      dispatch(
        updateCartQuantity({
          productId,
          quantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecrease = (productId: string) => {
    const item = items.find((item) => item.product._id === productId);
    if (item && item.quantity > 1) {
      dispatch(
        updateCartQuantity({
          productId,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  if (!isAuthenticated) {
    return (
      <main className="page-container">
        <div className="text-center space-y-4 py-12">
          <h1 className="section-title">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to view your cart</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 className="section-title">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-6 text-center">
              <p className="text-destructive font-medium">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => dispatch(fetchCart())}
              >
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center space-y-4 py-12 bg-muted rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground">
                Your Cart is Empty
              </h2>
              <p className="text-muted-foreground">
                Start shopping to add items to your cart
              </p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  isLoading={loading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className="lg:col-span-1 h-fit sticky top-6">
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </main>
  );
}
