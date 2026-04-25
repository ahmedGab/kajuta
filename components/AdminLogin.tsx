"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin, isAdminLoggedIn } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.push("/cajuta-dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      router.push("/cajuta-dashboard");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-mint/50 flex items-center justify-center p-4">
      <div className="card-premium p-10 w-full max-w-md bg-white border-t-8 border-green">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-3xl tracking-tight text-green block mb-2">
            CAJUTA<span className="text-caramel">.</span>
          </span>
          <h1 className="text-xl font-bold text-chocolate">Connexion Admin</h1>
          <p className="text-sm text-chocolate/60 mt-1">Espace sécurisé Cajuta</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-chocolate mb-2">
              Utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green focus:ring-2 focus:ring-mint outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-chocolate mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green focus:ring-2 focus:ring-mint outline-none transition-all"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary py-3">
            Se connecter
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          Pour production, remplacer cette authentification par Supabase Auth, NextAuth/Auth.js, Clerk ou Firebase Auth.
        </div>
      </div>
    </div>
  );
}
