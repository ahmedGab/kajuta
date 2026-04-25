import React from "react";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Dashboard Admin | Cajuta",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
