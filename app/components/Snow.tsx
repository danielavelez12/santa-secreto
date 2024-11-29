"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Snow = () => {
  const [snowflakes, setSnowflakes] = useState<
    Array<{ id: number; left: number; animationDuration: number }>
  >([]);

  useEffect(() => {
    const createSnowflake = () => {
      return {
        id: Math.random(),
        left: Math.random() * 100, // Random position from 0-100%
        animationDuration: Math.random() * 15 + 25, // Changed to 25-40s duration (was 10-25s)
      };
    };

    // Create initial snowflakes
    setSnowflakes(Array.from({ length: 30 }, createSnowflake));

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes((prev) => [...prev.slice(-29), createSnowflake()]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="absolute top-0 opacity-70"
          style={{
            left: `${snowflake.left}%`,
            animation: `fall ${snowflake.animationDuration}s linear infinite`,
            transform: "translateZ(0)",
          }}
        >
          <Image
            src="/snowflake.png"
            alt="snowflake"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
