"use client";
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
        animationDuration: Math.random() * 100 + 10, // Changed to 10-25s duration
      };
    };

    // Create initial snowflakes
    setSnowflakes(Array.from({ length: 50 }, createSnowflake));

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes((prev) => [...prev.slice(-49), createSnowflake()]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="absolute top-0 text-white opacity-70"
          style={{
            left: `${snowflake.left}%`,
            animation: `fall ${snowflake.animationDuration}s linear infinite`,
            transform: "translateZ(0)",
          }}
        >
          ❄
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
