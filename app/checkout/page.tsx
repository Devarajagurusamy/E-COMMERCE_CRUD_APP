"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchCart } from "@/lib/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  MapPin,
  CreditCard,
  Plus,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { processCheckout } from "@/lib/utils/checkout";

interface AddressItem {
  _id: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  building?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { items, totalItems, totalPrice, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );
  const { isAuthenticated, user: authUser } = useSelector(
    (state: RootState) => state.auth
  );

  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Customer Details Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // New/Edit Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [addressPhone, setAddressPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [building, setBuilding] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/user/profile");
      if (res.data.success) {
        const u = res.data.user;
        setCustomerName(u.name || "");
        setCustomerEmail(u.email || "");
        setCustomerPhone(u.phone || "");

        const addrs: AddressItem[] = res.data.addresses || [];
        setAddresses(addrs);

        if (addrs.length > 0) {
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          // Pre-fill recipient name and phone for new address
          setRecipientName(u.name || "");
          setAddressPhone(u.phone || "");
          setShowAddressForm(true);
        }
      }
    } catch (err: any) {
      console.error("Failed to load checkout profile data:", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddAddress = () => {
    setEditingAddressId(null);
    setRecipientName(customerName);
    setAddressPhone(customerPhone);
    setAddressLine("");
    setBuilding("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("India");
    setAddressError(null);
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    setAddressSaving(true);

    const payload = {
      recipientName,
      phone: addressPhone,
      addressLine,
      building,
      city,
      state,
      postalCode,
      country,
      isDefault: addresses.length === 0,
    };

    try {
      if (editingAddressId) {
        await axiosInstance.put(`/api/user/addresses/${editingAddressId}`, payload);
      } else {
        const res = await axiosInstance.post("/api/user/addresses", payload);
        if (res.data.success && res.data.address) {
          setSelectedAddressId(res.data.address._id);
        }
      }
      setShowAddressForm(false);
      loadData();
    } catch (err: any) {
      setAddressError(err.response?.data?.message || "Failed to save delivery address");
    } finally {
      setAddressSaving(false);
    }
  };

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handleProceedToPayment = () => {
    setCheckoutError(null);

    if (!selectedAddress) {
      setCheckoutError("Please select or add a delivery address before proceeding to payment.");
      return;
    }

    if (!customerPhone || customerPhone.trim().length === 0) {
      setCheckoutError("Please provide a contact phone number before completing payment.");
      setIsEditingCustomer(true);
      return;
    }

    const checkoutPayload = {
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      shippingAddress: {
        recipientName: selectedAddress.recipientName,
        phone: selectedAddress.phone,
        address: `${selectedAddress.building ? selectedAddress.building + ", " : ""}${selectedAddress.addressLine}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
      },
    };

    processCheckout({
      dispatch,
      router,
      setIsCheckingOut,
      setCheckoutError,
      checkoutPayload,
    });
  };

  if (loading || cartLoading) {
    return (
      <main className="max-w-6xl mx-auto py-16 text-center">
        <p className="text-muted-foreground text-sm">Preparing payment confirmation review...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <ShoppingBag className="w-14 h-14 text-muted-foreground mx-auto opacity-40" />
        <h1 className="text-2xl font-bold text-foreground">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Add items to your cart before proceeding to the payment confirmation page.
        </p>
        <Link href="/products">
          <Button variant="default" className="mt-2">
            Browse Products
          </Button>
        </Link>
      </main>
    );
  }

  const shippingFee = 0;
  const discount = 0;
  const finalPayable = totalPrice + shippingFee - discount;

  return (
    <main className="max-w-6xl mx-auto space-y-8 py-8 px-4 md:px-6 pb-16">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/cart">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </Button>
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">Payment Confirmation</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Payment Confirmation & Review
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your items, customer information, and delivery address before completing secure payment.
        </p>
      </div>

      {checkoutError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive font-medium">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: STEP REVIEWS */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: PRODUCT REVIEW */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span>1. Review Products ({items.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="divide-y divide-border">
                {items.map((item: any) => {
                  const prod = item.product || {};
                  const unitPrice = prod?.discount
                    ? Math.round(prod.price * (1 - prod.discount / 100))
                    : prod?.price || 0;
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div key={prod._id || item.productId} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border shrink-0">
                        {prod.image ? (
                          <Image src={prod.image} alt={prod.title || "Product"} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {prod.title}
                        </h4>
                        {(prod.brand || prod.clothType) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[prod.brand, prod.clothType].filter(Boolean).join(" • ")}
                          </p>
                        )}
                        <p className="text-xs font-medium text-foreground mt-1">
                          Qty: {item.quantity} × ₹{unitPrice}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">
                          ₹{lineTotal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* STEP 2: CUSTOMER DETAILS REVIEW & EDIT */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span>2. Customer Details</span>
              </CardTitle>
              {!isEditingCustomer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingCustomer(true)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditingCustomer ? (
                <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsEditingCustomer(false)}
                    className="mt-1"
                  >
                    Done Editing
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>
                    <p className="font-semibold text-foreground text-sm">{customerName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email Address:</span>
                    <p className="font-semibold text-foreground text-sm truncate">{customerEmail || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone Number:</span>
                    <p className="font-semibold text-foreground text-sm">{customerPhone || "Not provided"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* STEP 3: DELIVERY ADDRESS SELECTION & MANAGEMENT */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>3. Delivery Address</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddAddress}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-4 bg-muted/40 border border-primary/20 rounded-xl space-y-3"
                >
                  <h4 className="text-xs font-bold text-foreground">Add / Edit Delivery Address</h4>

                  {addressError && (
                    <div className="p-2 bg-destructive/10 text-xs text-destructive rounded">
                      {addressError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Name *"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-background text-foreground"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Phone Number *"
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Address Line (Street / House No) *"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                  />

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-background text-foreground"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-background text-foreground"
                    />
                    <input
                      type="text"
                      required
                      placeholder="PIN Code *"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="px-3 py-1.5 border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={addressSaving} size="sm">
                      {addressSaving ? "Saving..." : "Use This Address"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <p className="text-xs text-amber-600 font-medium">
                  No delivery address selected. Please click "Add Address" above to enter your delivery address.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;

                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-muted-foreground/30"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-foreground">
                            {addr.recipientName}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {addr.addressLine}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Ph: {addr.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: PAYMENT SUMMARY & ACTION */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/20 sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({totalItems} items):</span>
                  <span className="font-semibold text-foreground">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount:</span>
                  <span className="font-semibold text-emerald-600">-₹0</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-foreground">Final Payable Amount:</span>
                  <span className="font-bold text-2xl text-foreground">
                    ₹{finalPayable}
                  </span>
                </div>
              </div>

              <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure Razorpay Gateway</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Payment method: Cards, UPI, Netbanking, Wallets.
                </p>
              </div>

              <Button
                size="lg"
                disabled={isCheckingOut || !selectedAddressId}
                onClick={handleProceedToPayment}
                className="w-full gap-2 text-base font-bold shadow-lg"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
