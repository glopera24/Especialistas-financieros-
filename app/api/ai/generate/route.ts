import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      field,
      context,
    } = body;

    let prompt = "";

    // ── Single field generation ─────────────────────

    if (field === "description") {

      prompt = `
      Redacta una descripción técnica y financiera
      profesional para este proyecto:

      ${context}
      `;

    }

    // ── Full auto generation ───────────────────────

    if (field === "full_project_analysis") {

      prompt = `
      Analiza este proyecto productivo:

      ${context}

      Y genera:

      - capacidad productiva estimada
      - impacto social
      - impacto ambiental
      - empleos proyectados
      - beneficiarios estimados

      Responde SOLO en formato JSON válido.

      Ejemplo:

      {
        "productive_capacity": "",
        "social_impact": "",
        "environmental_impact": "",
        "projected_jobs": 0,
        "beneficiaries": 0
      }
      `;

    }

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,

      });

    const result =
      completion.choices[0].message.content;

    // ── Return JSON if full analysis ───────────────

    if (field === "full_project_analysis") {

      return NextResponse.json(
        JSON.parse(result || "{}")
      );

    }

    return NextResponse.json({
      result,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Error generando contenido",
      },
      {
        status: 500,
      }
    );

  }

}