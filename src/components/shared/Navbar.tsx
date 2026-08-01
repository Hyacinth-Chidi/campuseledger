"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="CampusLedger Logo" width={180} height={45} className="object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <Link href="#features" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2 rounded-full transition-all">
            How it Works
          </Link>
          <Link href="#security" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2 rounded-full transition-all">
            Security
          </Link>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <Link href="/student/login" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2 rounded-full transition-all">
            Student Login
          </Link>
          <Link href="/verify" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2 rounded-full transition-all">
            Verify Credential
          </Link>
          <Button asChild className="ml-2 rounded-full px-6 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:bg-primary/90 transition-all">
            <Link href="/institution/signup">Issue Credentials</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-slate-200/60 bg-white/95 backdrop-blur-lg px-6 py-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-2 font-medium text-slate-600">
            <Link 
              href="#features" 
              className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="#security" 
              className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </Link>
            <div className="my-2 h-px w-full bg-slate-100" />
            <Link 
              href="/student/login" 
              className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Student Login
            </Link>
            <Link 
              href="/verify" 
              className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Verify Credential
            </Link>
            <Link 
              href="/institution/login" 
              className="px-4 py-3 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Institution Login
            </Link>
            <div className="pt-4">
              <Button asChild className="w-full rounded-full shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]">
                <Link href="/institution/signup" onClick={() => setMobileMenuOpen(false)}>
                  Issue Credentials
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
