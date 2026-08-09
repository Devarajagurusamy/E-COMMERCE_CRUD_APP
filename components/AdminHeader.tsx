"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { logout, fetchCurrentUser } from "@/lib/store/slices/authSlice";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  Menu,
  X,
  Package,
  ShoppingBag,
  Users,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

interface SearchResultItem {
  id: string;
  type: "PRODUCT" | "ORDER" | "CUSTOMER" | "USER";
  title: string;
  subtitle: string;
  image?: string;
  url: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "inventory" | "order" | "system";
  time: string;
  url: string;
  read: boolean;
}

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export default function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    products: SearchResultItem[];
    orders: SearchResultItem[];
    users: SearchResultItem[];
  }>({ products: [], orders: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  // Profile Dropdown State
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load Admin profile if missing
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  // Fetch Notifications
  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await axiosInstance.get("/api/admin/notifications");
        if (res.data.success) {
          setNotifications(res.data.data);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        console.error("Notif fetch failed:", err);
      }
    };
    loadNotifs();
  }, []);

  // Universal Search Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], orders: [], users: [] });
      setShowSearchPopover(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSearchPopover(true);
      try {
        const res = await axiosInstance.get(
          `/api/admin/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Outside click listener to close popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchPopover(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      dispatch(logout());
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const totalResultsCount =
    searchResults.products.length +
    searchResults.orders.length +
    searchResults.users.length;

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile Toggle & Universal Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Universal Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-lg">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchPopover(true);
              }}
              className="w-full pl-10 pr-9 py-2 text-sm bg-muted/50 border border-border/70 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Universal Search Popover Results */}
          {showSearchPopover && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
              <div className="p-3 border-b border-border/60 bg-muted/30 text-xs font-semibold text-muted-foreground flex justify-between">
                <span>SEARCH RESULTS</span>
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <span>{totalResultsCount} results found</span>
                )}
              </div>

              {isSearching ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Searching across store records...
                </div>
              ) : totalResultsCount === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No matching products, orders or users found for "{searchQuery}".
                </div>
              ) : (
                <div className="p-2 space-y-3">
                  {/* Products Results */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        <span>Products</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.products.map((item) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => setShowSearchPopover(false)}
                            className="flex items-center gap-3 p-2 hover:bg-accent rounded-xl transition-colors"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                                PROD
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.subtitle}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders Results */}
                  {searchResults.orders.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 border-t border-border/50 pt-2">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Orders</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.orders.map((item) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => setShowSearchPopover(false)}
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-xl transition-colors"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.subtitle}
                              </p>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              View Order
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users / Customers Results */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 border-t border-border/50 pt-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>Users & Customers</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {searchResults.users.map((item) => (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={() => setShowSearchPopover(false)}
                            className="flex items-center justify-between p-2 hover:bg-accent rounded-xl transition-colors"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.subtitle}
                              </p>
                            </div>
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-mono">
                              {item.type}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Notifications & Dynamic Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon & Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="relative p-2.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifPopover && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} unread
                </span>
              </div>

              <div className="divide-y divide-border/60 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      href={n.url}
                      onClick={() => setShowNotifPopover(false)}
                      className="p-3.5 flex items-start gap-3 hover:bg-accent/50 transition-colors block"
                    >
                      <div
                        className={`p-2 rounded-xl mt-0.5 ${
                          n.type === "inventory"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Admin User Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-2.5 rounded-full hover:bg-muted/80 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-primary/20 overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "A"
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight text-foreground truncate max-w-[120px]">
                {user?.name || "Devaraja"}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium capitalize">
                {user?.role === "admin" ? "Administrator" : user?.role || "Administrator"}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-border/60 mb-1">
                <p className="text-xs font-bold text-foreground">{user?.name || "Devaraja"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@ecommerce.com"}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-accent transition-colors text-foreground"
              >
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>View Profile</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-accent transition-colors text-foreground"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Account Settings</span>
              </Link>

              <div className="border-t border-border/60 my-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-medium rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
