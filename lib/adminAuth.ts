"use client";

// Sécurité: Pour production, remplacer cette authentification par Supabase Auth, NextAuth/Auth.js, Clerk ou Firebase Auth.

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "cajuta-admin";

export function loginAdmin(username: string, password: string): boolean {
  if (typeof window === "undefined") return false;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem("cajuta_admin_logged_in", "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("cajuta_admin_logged_in");
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("cajuta_admin_logged_in") === "true";
}
