import Link from "next/link";
import Image from "next/image";
import { PhoneCall, Truck, ShieldCheck, Clock, MessageSquare, ArrowUpRight, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 border-t bg-card text-card-foreground">
      {/* Top Value Badges Bar */}
      <div className="border-b bg-emerald-50/60 dark:bg-emerald-950/20 py-5 sm:py-6">
        <div className="container-shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-600/10 p-2 sm:p-2.5 text-emerald-700 dark:text-emerald-400 shrink-0">
              <PhoneCall size={19} className="shrink-0" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">২৪/৭ কাস্টমার সার্ভিস</p>
              <a href="tel:01758749698" className="text-muted-foreground hover:text-emerald-700 transition font-semibold truncate block">
                হটলাইন: 01758749698
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-600/10 p-2 sm:p-2.5 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Truck size={19} className="shrink-0" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">সারা বাংলাদেশে ডেলিভারি</p>
              <p className="text-muted-foreground truncate">ঢাকা ও ঢাকার বাইরে দ্রুত হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-600/10 p-2 sm:p-2.5 text-emerald-700 dark:text-emerald-400 shrink-0">
              <ShieldCheck size={19} className="shrink-0" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">১০০% নির্ভেজাল ও তাজা</p>
              <p className="text-muted-foreground truncate">তাজা ও পুষ্টিকর খাদ্যপণ্যের নিশ্চয়তা</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-600/10 p-2 sm:p-2.5 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Clock size={19} className="shrink-0" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">ক্যাশ অন ডেলিভারি</p>
              <p className="text-muted-foreground truncate">পণ্য দেখে মূল্য পরিশোধের সুবিধা</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-shell py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-7 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand & Address */}
          <div className="space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/30">
                <Image
                  src="/image/savory.jpg"
                  alt="Savory Nest Logo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
                Savory <span className="text-emerald-600 dark:text-emerald-300 font-extrabold">Nest</span>
              </span>
            </Link>

            {/* Address in place of Dialogue */}
            <div className="rounded-2xl border bg-muted/40 p-3.5 sm:p-4 shadow-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">ঠিকানা / Address</p>
                  <p className="mt-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    Khilkhet, Dhaka 1229
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                    খিলক্ষেত, ঢাকা ১২২৯, বাংলাদেশ।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Hotline & Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
              হটলাইন ও যোগাযোগ
            </h3>
            <p className="text-xs text-muted-foreground">
              যেকোনো অর্ডার বা তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন:
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="tel:01758749698"
                className="flex items-center gap-2 rounded-xl border bg-card p-2.5 font-bold text-emerald-700 hover:border-emerald-600 transition shadow-sm"
              >
                <PhoneCall size={16} className="shrink-0" />
                <span>হটলাইন: 01758749698</span>
              </a>
              <a
                href="https://wa.me/8801758749698"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border bg-card p-2.5 font-bold text-emerald-700 hover:border-emerald-600 transition shadow-sm"
              >
                <MessageSquare size={16} className="shrink-0" />
                <span>WhatsApp: 01758749698</span>
              </a>
              <p className="text-[11px] text-muted-foreground pt-0.5">
                সময়: প্রতিদিন সকাল ৯:০০ টা — রাত ১০:০০ টা
              </p>
            </div>
          </div>

          {/* 3. Facebook Page & Social Links */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
              ফেসবুক পেজ
            </h3>
            <p className="text-xs text-muted-foreground">
              আমাদের অফিসিয়াল ফেসবুক পেজে যুক্ত থাকুন এবং আকর্ষণীয় অফার ও ডিসকাউন্ট সম্পর্কে সবার আগে জানুন।
            </p>
            <a
              href="https://www.facebook.com/savorynestbd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-3 w-full rounded-xl bg-[#1877F2] hover:bg-[#0c63d4] px-4 py-2.5 text-xs font-bold text-white transition shadow-sm"
            >
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>facebook.com/savorynestbd</span>
              </span>
              <ArrowUpRight size={15} className="shrink-0" />
            </a>
            <div className="rounded-xl border p-2.5 text-[11px] text-muted-foreground">
              <span>ফেসবুক পেজ ভিজিট করতে ওপরের বাটনে ক্লিক করুন।</span>
            </div>
          </div>

          {/* 4. Delivery Areas & Charges */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400">
              ডেলিভারি চার্জ তথ্য
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>ঢাকার ভিতরে (Inside Dhaka):</span>
                <b className="text-emerald-700">৳ ৬০</b>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
                <span>ঢাকার বাইরে (Outside Dhaka):</span>
                <b className="text-emerald-700">৳ ১২০</b>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                চেকআউটের সময় আপনার ঠিকানা অনুযায়ী স্বয়ংক্রিয়ভাবে ডেলিভারি চার্জ যুক্ত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-between gap-3 sm:gap-4 border-t pt-5 sm:pt-6 text-xs text-muted-foreground sm:flex-row">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Savory Nest. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/#products" className="hover:text-foreground transition">পণ্যসমূহ</Link>
            <Link href="/#categories" className="hover:text-foreground transition">ক্যাটাগরি</Link>
            <Link href="/cart" className="hover:text-foreground transition">কার্ট</Link>
            <Link href="/admin/login" className="hover:text-foreground transition">অ্যাডমিন</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
