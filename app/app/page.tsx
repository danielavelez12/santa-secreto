"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { createDecipheriv } from "crypto";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCountdown } from "../hooks/useCountdown";

interface Assignment {
  userId: string;
  // ... other assignment properties
}

export default function Home() {
  const [recipient, setRecipient] = useState<string | null>(null);
  const { user } = useUser();
  const timeLeft = useCountdown(new Date("2024-12-24"));

  useEffect(() => {
    const fetchAssignment = async () => {
      console.log("running");
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (user && data.success && data.assignments) {
          const userAssignment = data.assignments.find(
            (assignment: Assignment) => assignment.userId === user.id
          );
          console.log(userAssignment);
          if (userAssignment) {
            console.log({ userAssignment });
            const decryptedUsername = (() => {
              try {
                const decipher = createDecipheriv(
                  "aes-256-cbc",
                  "santa-secreto-con-los-garcias!!!",
                  Buffer.from(userAssignment.iv, "hex")
                );
                console.log({ decipher });
                let decrypted = decipher.update(
                  userAssignment.recipientEncryptedUsername,
                  "hex",
                  "utf8"
                );
                console.log({ decrypted });
                decrypted += decipher.final("utf8");
                console.log({ decrypted });
                return decrypted;
              } catch (error) {
                console.error("Decryption error:", error);
                return null;
              }
            })();
            console.log(decryptedUsername);
            setRecipient(decryptedUsername || "Usuario no encontrado");
          }
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    if (user) {
      fetchAssignment();
    }
  }, [user]);

  return (
    <>
      <SignedIn>
        <div className="container mx-auto px-4 py-8">
          <div className="relative w-64 h-32 mx-auto mb-6">
            <Image
              src="/santa.gif"
              alt="Santa animation"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-3xl font-bold mb-6 text-center">
            Su persona asignada es
            {recipient
              ? " " + recipient.charAt(0).toUpperCase() + recipient.slice(1)
              : "..."}
          </h1>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Cuenta Regresiva para Navidad
              </h2>
              <div className="grid grid-cols-4 gap-2 text-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div
                    key={unit}
                    className="bg-primary text-primary-foreground rounded-lg p-2"
                  >
                    <div className="text-2xl font-bold">{value as string}</div>
                    <div className="text-[10px]">{unit as string}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center gap-4 pt-20">
          <div className="relative w-64 h-64">
            <Image
              src="/santa.gif"
              alt="Santa animation"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold">Santa Secreto</h1>

          <SignInButton mode="modal">Iniciar Sesión</SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
