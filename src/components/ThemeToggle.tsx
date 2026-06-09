"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
    // Fire custom event to notify other mounted components if necessary
    window.dispatchEvent(new Event("themechange"));
  };

  // Prevent hydration layout mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 animate-pulse shrink-0" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-foreground hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer select-none shrink-0"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme color"
    >
      {isDark ? (
        <Sun size={16} className="text-amber-400 animate-in spin-in-12 duration-300" />
      ) : (
        <Moon size={16} className="text-gray-600 animate-in spin-in-12 duration-300" />
      )}
    </button>
  );
}
