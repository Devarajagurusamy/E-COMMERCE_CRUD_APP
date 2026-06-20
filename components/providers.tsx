"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import Header from "@/components/Header";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Header />
      {children}
    </Provider>
  );
}
