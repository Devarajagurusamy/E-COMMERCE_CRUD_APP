import axiosInstance from "@/lib/axios";
import { fetchCart } from "@/lib/store/slices/cartSlice";
import { AppDispatch } from "@/lib/store";

export interface ProcessCheckoutOptions {
  dispatch: AppDispatch;
  router: { push: (url: string) => void };
  setIsCheckingOut: (loading: boolean) => void;
  setCheckoutError: (error: string | null) => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
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

export const handleCancelOrder = async (razorpayOrderId: string) => {
  try {
    await axiosInstance.post("/api/checkout/cancel", {
      razorpay_order_id: razorpayOrderId,
    });
  } catch (err) {
    console.error("Failed to update cancelled order status:", err);
  }
};

export const processCheckout = async ({
  dispatch,
  router,
  setIsCheckingOut,
  setCheckoutError,
}: ProcessCheckoutOptions) => {
  setCheckoutError(null);
  setIsCheckingOut(true);

  try {
    // 1. Create order on server
    const { data } = await axiosInstance.post("/api/checkout/create-order");

    if (!data.success) {
      setCheckoutError(data.message || "Failed to initiate order");
      setIsCheckingOut(false);
      return;
    }

    // 2. Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setCheckoutError("Razorpay SDK failed to load. Are you online?");
      setIsCheckingOut(false);
      return;
    }

    // 3. Open Razorpay Modal Window
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "E-Commerce Clothing Store",
      description: "Purchase Checkout",
      order_id: data.razorpayOrderId,
      handler: async function (response: any) {
        try {
          // 4. Verify Payment Signature
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

    // Handle explicit payment failure event inside modal
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
