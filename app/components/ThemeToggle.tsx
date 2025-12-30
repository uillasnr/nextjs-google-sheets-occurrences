"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center gap-3 px-4 py-3 rounded-lg
      bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700
      hover:bg-gray-300 dark:hover:bg-gray-700
      transition-colors shadow-md text-sm dark:text-white"
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
      Tema
    </button>
  );
}
