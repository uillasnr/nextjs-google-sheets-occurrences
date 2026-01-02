"use client";

import Image from "next/image";
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
        
        {/* Container do Capacete */}
        <div className="relative flex flex-col items-center">
          
          {/* Capacete com animação de flutuar (bounce suave) */}
          <div className="animate-bounce-slow">
            <Image 
              src={"/capacete web.png"} 
              alt="Capacete Web" 
              width={128} 
              height={128} 
              className="drop-shadow-[0_10px_15px_rgba(33,118,230,0.3)]"
            />
          </div>

          {/* Sombra dinâmica que reage à altura do capacete */}
          <div
            className="h-1.5 w-16 rounded-full blur-md animate-shadow-pulse mt-4"
            style={{ backgroundColor: "#2176E666" }} 
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
                  backgroundColor: "#2176E6",
                  animationDelay: `${-0.15 * (2 - i)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Estilos CSS para as animações customizadas */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shadow-pulse {
          0%, 100% { transform: scaleX(1); opacity: 0.6; }
          50% { transform: scaleX(0.7); opacity: 0.2; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-shadow-pulse {
          animation: shadow-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}