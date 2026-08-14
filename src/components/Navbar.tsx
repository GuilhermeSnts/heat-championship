"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useState, useEffect } from "react";
import { X, Menu, Trophy, NotebookText, Settings, DoorOpen, User, Car } from "lucide-react";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <nav className="bg-linear-to-r from-rose-800 to-orange-400 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Car className="w-6 h-6" />
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

            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile drawer + overlay */}
        {/* Mobile drawer + overlay (right side with ease-in-out animation) */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden={!menuOpen}
        >
          <div className="absolute inset-0 bg-black/60 " />
        </div>

        <aside
          className={`fixed right-0 top-0 h-full w-64 bg-rose-900 text-white z-50 md:hidden transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          role="dialog"
          aria-modal="true"
          aria-hidden={!menuOpen}
        >
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span>Menu</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
              className="p-2 rounded hover:bg-white/10"
            >
              <X />
            </button>
          </div>

          <nav className="flex flex-col gap-3 p-4">
            <Link
              href="/"
              className="hover:text-red-200 transition-colors flex gap-2 items-center"
              onClick={() => setMenuOpen(false)}
            >
              <Trophy className="inline-block mr-1" size={16} />
              <span>Classificação</span>
            </Link>
            <Link
              href="/regras"
              className="hover:text-red-200 transition-colors flex gap-2 items-center"
              onClick={() => setMenuOpen(false)}
            >
              <NotebookText className="inline-block mr-1" size={16} />
              <span>Regras</span>
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-red-200 transition-colors flex gap-2 items-center"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="inline-block mr-1" size={16} />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left hover:text-red-200 transition-colors flex gap-2 items-center"
              >
                <DoorOpen className="inline-block mr-1" size={16} />
                <span>Sair</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="hover:text-red-200 transition-colors flex gap-2 items-center"
                onClick={() => setMenuOpen(false)}
              >
                <User className="inline-block mr-1" size={16} />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </aside>
      </div>
    </nav>
  );
}
