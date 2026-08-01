"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

const statements = [
  "W3C Verifiable Credentials Standard",
  "Mathematical Trust & Privacy",
  "Zero-Knowledge Proofs Ready",
  "Biometric Authenticated Access"
];

export function AnimatedBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % statements.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 backdrop-blur-sm overflow-hidden w-[310px] h-9 relative">
      <div className="relative flex items-center justify-center shrink-0 mr-2 z-10">
        <ShieldCheck className="size-4 relative z-10 text-primary" />
        <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping" />
      </div>
      <div className="relative flex-1 h-full flex items-center">
        {statements.map((stmt, i) => (
          <span
            key={stmt}
            className="absolute left-0 w-full whitespace-nowrap transition-all duration-700 ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transform: `translateY(${i === index ? '0' : i === (index - 1 + statements.length) % statements.length ? '-150%' : '150%'})`,
            }}
          >
            {stmt}
          </span>
        ))}
      </div>
    </div>
  );
}
