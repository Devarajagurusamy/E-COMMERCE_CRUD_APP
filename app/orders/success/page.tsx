"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-card border border-border rounded-2xl shadow-lg text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="h-12 w-12" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment Successful!
        </h1>
        <p className="text-sm text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully and is being processed.
        </p>
      </div>

      {orderId && (
        <div className="bg-muted p-3 rounded-lg text-xs font-mono text-muted-foreground break-all">
          Order Reference ID: <span className="font-semibold text-foreground">{orderId}</span>
        </div>
      )}

      <div className="pt-4 flex flex-col gap-3">
        <Link href="/products" className="w-full">
          <Button className="w-full gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="page-container flex items-center justify-center min-h-[70vh]">
      <Suspense fallback={<div className="text-center p-8 text-muted-foreground">Loading order details...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
