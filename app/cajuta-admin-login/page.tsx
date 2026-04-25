import React from "react";
import AdminLogin from "@/components/AdminLogin";

export const metadata = {
  title: "Connexion Admin | Cajuta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
