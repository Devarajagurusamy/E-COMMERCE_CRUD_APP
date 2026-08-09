"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

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

interface OrderSummary {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  items: any[];
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Address Modal / Form State
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
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/user/profile");
      if (res.data.success) {
        setUser(res.data.user);
        setAddresses(res.data.addresses || []);
        setRecentOrders(res.data.recentOrders || []);

        setEditName(res.data.user.name || "");
        setEditPhone(res.data.user.phone || "");
        setEditAvatar(res.data.user.avatar || "");
      }
    } catch (err: any) {
      console.error("Fetch profile failed:", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaving(true);

    try {
      const res = await axiosInstance.put("/api/user/profile", {
        name: editName,
        phone: editPhone,
        avatar: editAvatar,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsEditingProfile(false);
      }
    } catch (err: any) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile details"
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const openAddAddressForm = () => {
    setEditingAddressId(null);
    setRecipientName(user?.name || "");
    setAddressPhone(user?.phone || "");
    setAddressLine("");
    setBuilding("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("India");
    setIsDefaultAddress(addresses.length === 0);
    setAddressError(null);
    setShowAddressForm(true);
  };

  const openEditAddressForm = (addr: AddressItem) => {
    setEditingAddressId(addr._id);
    setRecipientName(addr.recipientName);
    setAddressPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setBuilding(addr.building || "");
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country || "India");
    setIsDefaultAddress(addr.isDefault);
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
      isDefault: isDefaultAddress,
    };

    try {
      if (editingAddressId) {
        await axiosInstance.put(`/api/user/addresses/${editingAddressId}`, payload);
      } else {
        await axiosInstance.post("/api/user/addresses", payload);
      }

      setShowAddressForm(false);
      fetchProfileData();
    } catch (err: any) {
      setAddressError(
        err.response?.data?.message || "Failed to save address"
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await axiosInstance.delete(`/api/user/addresses/${addressId}`);
      fetchProfileData();
    } catch (err) {
      console.error("Delete address error:", err);
    }
  };

  const handleSetDefaultAddress = async (addr: AddressItem) => {
    try {
      await axiosInstance.put(`/api/user/addresses/${addr._id}`, {
        ...addr,
        isDefault: true,
      });
      fetchProfileData();
    } catch (err) {
      console.error("Set default address error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Shipped":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "Confirmed":
      case "Processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Cancelled":
      case "Failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto py-16 text-center">
        <p className="text-muted-foreground text-sm">Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="max-w-6xl mx-auto space-y-8 pb-12 px-4 md:px-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-card to-muted border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {user.name}
              </h1>
              {user.role === "admin" && (
                <span className="bg-primary/20 text-primary text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <Link href="/orders">
          <Button variant="default" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders Page</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - CUSTOMER INFORMATION */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" />
                <span>Customer Info</span>
              </CardTitle>
              {!isEditingProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {profileError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
                      {profileError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-muted text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Profile Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={profileSaving}
                      size="sm"
                      className="flex-1"
                    >
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-semibold text-foreground">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold text-foreground">
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - ADDRESSES & ORDER HISTORY SUMMARY */}
        <div className="lg:col-span-2 space-y-8">
          {/* ADDRESS INFORMATION */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Delivery Addresses ({addresses.length})</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddAddressForm}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add/Edit Address Inline Modal/Form */}
              {showAddressForm && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-4 bg-muted/30 border border-primary/20 rounded-xl space-y-3 mb-4"
                >
                  <h4 className="text-sm font-semibold text-foreground">
                    {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                  </h4>

                  {addressError && (
                    <div className="p-2.5 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">
                      {addressError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressPhone}
                        onChange={(e) => setAddressPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Address Line *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street name, house number"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Apartment / Building / Area
                      </label>
                      <input
                        type="text"
                        placeholder="Apt 4B, Green Valley"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        PIN / Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={isDefaultAddress}
                      onChange={(e) => setIsDefaultAddress(e.target.checked)}
                      className="rounded border-border"
                    />
                    <label htmlFor="isDefault" className="text-xs text-foreground cursor-pointer">
                      Set as Default Delivery Address
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={addressSaving} size="sm">
                      {addressSaving ? "Saving..." : "Save Address"}
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

              {/* Saved Addresses List */}
              {addresses.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-xl space-y-2">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground">
                    No delivery addresses saved yet. Click "Add Address" above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all ${
                        addr.isDefault
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-semibold text-sm text-foreground">
                            {addr.recipientName}
                          </p>
                          {addr.isDefault && (
                            <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {addr.building ? `${addr.building}, ` : ""}
                          {addr.addressLine}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          Ph: {addr.phone}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            Set Default
                          </button>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => openEditAddressForm(addr)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ORDER HISTORY SUMMARY */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span>Recent Orders Summary</span>
              </CardTitle>
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-primary">
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-xs text-muted-foreground">
                    You haven't placed any orders yet.
                  </p>
                  <Link href="/products">
                    <Button size="sm" variant="outline">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((ord) => {
                    const totalProductsCount = ord.items.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    );

                    return (
                      <div
                        key={ord._id}
                        className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-foreground">
                              #{ord._id.slice(-6).toUpperCase()}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusBadge(
                                ord.orderStatus
                              )}`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            • {totalProductsCount} Item{totalProductsCount !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="font-extrabold text-foreground text-base">
                              ₹{ord.totalAmount}
                            </p>
                          </div>

                          <Link href={`/orders/${ord._id}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
