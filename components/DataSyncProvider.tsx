"use client";

import { useEffect } from "react";
import { syncAllDataFromSupabase } from "@/lib/useSiteData";

export default function DataSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sync data from Supabase on page load
    const syncData = async () => {
      try {
        await syncAllDataFromSupabase();
      } catch (error) {
        console.error("Data sync error:", error);
      }
    };

    syncData();
  }, []);

  return <>{children}</>;
}