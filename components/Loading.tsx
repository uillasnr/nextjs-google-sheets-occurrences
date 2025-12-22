"use client";

import React, { useEffect } from "react";

interface LoadingProps {
  isOpen: boolean;
  text?: string;
}

export default function Loading({ isOpen, text = "Carregando Ocorrências" }: LoadingProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Capacete animado */}
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="w-24 h-24 drop-shadow-[0_0_15px_rgba(33,118,230,0.6)] animate-spin"
            fill="none"
            stroke="#2176E6"  // cor azul
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9" />
            <path d="M4 11c1.5-1 4-1.5 8-1.5s6.5.5 8 1.5l1 3H3l1-3z" fill="#2176E640" /> {/* azul translúcido */}
            <path d="M21 14v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1" />
            <path d="M3 14l3 5h12l3-5" />
            <path d="M12 3v3" className="opacity-40" />
            <path d="M8 17l1 2" className="opacity-60" />
            <path d="M16 17l-1 2" className="opacity-60" />
          </svg>

          {/* Sombra dinâmica */}
          <div
            className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 h-1.5 w-16 rounded-full blur-md animate-pulse"
            style={{ backgroundColor: "#2176E666" }} // sombra azul translúcida
          />
        </div>

        {/* Texto e bolinhas */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-white font-bold text-xs tracking-widest uppercase animate-pulse drop-shadow-md">
            {text}
          </span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  backgroundColor: "#2176E6", // bolinhas azuis
                  animationDelay: `${-0.15 * (2 - i)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
