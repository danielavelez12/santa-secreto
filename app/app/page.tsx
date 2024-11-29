"use client";

import { Button } from "@/components/ui/button";
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

interface Suggestion {
  emoji: string;
  title: string;
  description: string;
  price: number;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  citations: Array<string>;
}

export default function Home() {
  const [recipient, setRecipient] = useState<string | null>(null);
  const { user } = useUser();
  const timeLeft = useCountdown(new Date("2024-12-24"));
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [citations, setCitations] = useState<Array<string>>([]);

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

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: recipient,
          previousSuggestions,
          comment,
        }),
      });
      const data: SuggestionsResponse = await response.json();
      setSuggestions(data.suggestions);
      setCitations(data.citations || []);

      setPreviousSuggestions((prev) => [
        ...prev,
        ...data.suggestions.map((s: Suggestion) => s.title),
      ]);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
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

          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div
                      key={unit}
                      className="bg-secondary text-secondary-foreground rounded-lg p-2"
                    >
                      <div className="text-2xl font-bold">
                        {value as string}
                      </div>
                      <div className="text-[10px]">{unit as string}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {recipient && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-left">
                    🎁 Sugerencias de regalo para{" "}
                    {recipient.charAt(0).toUpperCase() + recipient.slice(1)}
                  </h2>
                  <div>
                    <textarea
                      className="w-full p-2 border rounded-md resize-none mb-4"
                      placeholder="Añade un comentario opcional..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="suggestions-wrapper">
                    <div className="grid gap-4">
                      {suggestions.length > 0
                        ? suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-secondary space-y-2 opacity-0 break-words whitespace-normal"
                              style={{
                                animation: `fadeSlideUp 0.6s ease-out forwards`,
                                animationDelay: `${0.2 + index * 0.15}s`,
                                maxWidth: "100%",
                              }}
                            >
                              <h3 className="font-semibold">
                                {suggestion.emoji} {suggestion.title}
                              </h3>
                              <p className="text-sm">
                                {suggestion.description}
                              </p>
                            </div>
                          ))
                        : null}
                      {suggestions.length > 0 && citations.length > 0 && (
                        <div
                          className="p-4 rounded-lg bg-secondary space-y-2 opacity-0"
                          style={{
                            animation: `fadeSlideUp 0.6s ease-out forwards`,
                            animationDelay: `${
                              0.2 + suggestions.length * 0.15
                            }s`,
                          }}
                        >
                          <h4 className="font-semibold text-sm">Fuentes:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {citations.map((citation, index) => (
                              <li key={index} className="break-all">
                                {citation && (
                                  <a
                                    href={citation}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {citation}
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={fetchSuggestions}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="animate-spin h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Cargando sugerencias...
                          </span>
                        ) : (
                          "✨ Refrescar Sugerencias ✨"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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

          <h1 className="text-4xl font-bold">Amigo Secreto</h1>

          <SignInButton mode="modal">
            <Button size="lg">Iniciar Sesión</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
