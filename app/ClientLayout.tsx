"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdminPage = pathname.startsWith("/cajuta-dashboard") || pathname.startsWith("/cajuta-admin-login");

  return (
    <>
      {!isAdminPage && <Header />}
      <main className={`flex-grow ${!isAdminPage ? "pt-[72px]" : ""}`}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
    </>
  );
}