"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

import { store } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "./Footer";
import { fetchCurrentUser } from "@/lib/store/slices/authSlice";
import { ToastProvider } from "@/components/ui/toast";

function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthInitializer>
          <MainLayout>{children}</MainLayout>
        </AuthInitializer>
      </ToastProvider>
    </Provider>
  );
}