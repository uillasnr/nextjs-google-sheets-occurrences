"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-2 bg-card hover:bg-accent text-foreground px-4 py-2 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600 shadow-sm"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-5 h-5 text-yellow-500" />
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-600" />
        </>
      )}
    </button>
  );
}
