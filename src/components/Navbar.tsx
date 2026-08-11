"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-linear-to-r from-rose-800 to-rose-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🏎️</span>
            <span className="hidden sm:inline">Campeonato de Heat</span>
            <span className="sm:hidden">Heat</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-red-200 transition-colors">
              Classificação
            </Link>
            <Link href="/regras" className="hover:text-red-200 transition-colors">
              Regras
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-red-200 transition-colors"
              >
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link
              href="/"
              className="hover:text-red-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              🏆 Classificação
            </Link>
            <Link
              href="/regras"
              className="hover:text-red-200 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              📋 Regras
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-red-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                ⚙️ Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left hover:text-red-200 transition-colors"
              >
                🚪 Sair
              </button>
            ) : (
              <Link
                href="/login"
                className="hover:text-red-200 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                🔐 Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
