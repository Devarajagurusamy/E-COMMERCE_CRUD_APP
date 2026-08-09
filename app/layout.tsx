import type { Metadata } from "next";

import "./globals.css";

import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "E-Commerce Clothes App",
  description: "A full-stack e-commerce application for clothes shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased font-sans"
    >

      <body className="min-h-full flex flex-col">

        <ThemeProvider>

          <Providers>

            {children}

          </Providers>

        </ThemeProvider>

      </body>

    </html>

  );

}