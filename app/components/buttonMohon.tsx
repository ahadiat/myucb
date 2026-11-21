import React from "react";

type Props = {
    onClick?: () => void;
  };

export default function HeroCTA({ onClick }: Props) {
  return (
    <div>
      
      <button onClick={onClick} className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]">
        
        {/* Gradient Background */}
        <span className="absolute inset-0 bg-linear-to-r from-red-600 via-red to-black-600 opacity-90 group-hover:opacity-100 transition-all duration-500"></span>

        {/* Neon Glow */}
        <span className="absolute inset-0 blur-xl bg-linear-to-r from-red-500 via-black to-blue-500 opacity-60 group-hover:opacity-90 transition-all duration-500"></span>

        {/* Border */}
        <span className="absolute inset-0 border border-white/10 rounded-xl"></span>

        {/* Text */}
        <span className="relative z-10 flex items-center gap-2 tracking-wide">
          Mohon Sekarang
          
          {/* Arrow Icon */}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>

        {/* Shine Effect */}
        <span className="absolute left-[-75%] top-0 h-full w-1/2 bg-white/20 skew-x-12 transition-all duration-700 group-hover:left-[125%]"></span>

      </button>

    </div>
  );
}