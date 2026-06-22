"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

import { store } from "@/lib/store";
import Header from "@/components/Header";

import { fetchCurrentUser } from "@/lib/store/slices/authSlice";
import Footer from "./Footer";

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

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Header />
        {children}
        <Footer />
      </AuthInitializer>
    </Provider>
  );
}