import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, previousSuggestions, comment } = await request.json();

  try {
    const systemPrompt = `Eres un asistente de sugerencias para regalos para navidad. Responde ÚNICAMENTE con 3 buenas sugerencias de regalos en el siguiente formato JSON especificado. IMPORTANTE: Los precios deben ser números sin comas ni puntos.`;

    const userPrompt = `Sugiere 3 ideas TOTALMENTE DIFERENTES de regalos para Amigo Secreto para ${name} disponibles en Bogotá, cada uno por menos de 100.000 COP. ${
      comment ? `Información adicional: ${comment}. ` : ""
    }${
      previousSuggestions?.length > 0
        ? `NO sugieras estos regalos que ya fueron recomendados: ${previousSuggestions.join(
            ", "
          )}.`
        : ""
    } La respuesta debe estar en español y en formato JSON con "suggestions" que contengan "emoji", "title", "description" y "price".`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    const data = await response.json();
    console.log("API Response:", data.choices[0].message.content);
    const cleanContent = data.choices[0].message.content
      .replace(/```json\n|\n```/g, "")
      .replace(/(\d+),(\d+)/g, "$1$2")
      .trim();
    const parsedSuggestions = JSON.parse(cleanContent);

    return NextResponse.json(parsedSuggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
