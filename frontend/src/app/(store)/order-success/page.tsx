"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function OrderContent() {
  const params = useSearchParams();
  return <p className="mt-4 font-bold">{params.get("number")}</p>;
}

export default function OrderSuccess() {
  return (
    <div className="container-shell py-24">
      <div className="panel mx-auto max-w-lg py-12 text-center">
        <CheckCircle2 className="mx-auto text-emerald-600" size={54} />
        <h1 className="mt-5 text-2xl font-black">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order has been received. We will contact you to confirm delivery.
        </p>
        
        <Suspense fallback={<p className="mt-4 font-bold">Loading order details...</p>}>
          <OrderContent />
        </Suspense>

        <Link href="/" className="btn-primary mt-7 inline-block">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}