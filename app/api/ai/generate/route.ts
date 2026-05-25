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

    if (field === "description") {

      prompt = `
      Redacta una descripción técnica y financiera
      profesional para este proyecto:

      ${context}

      La respuesta debe ser clara,
      estructurada y profesional.
      `;

    }

    if (field === "social_impact") {

      prompt = `
      Describe el impacto social,
      generación de empleo y
      fortalecimiento económico local
      para este proyecto:

      ${context}
      `;

    }

    if (field === "environmental") {

      prompt = `
      Describe prácticas ambientales,
      sostenibilidad, manejo de residuos,
      eficiencia hídrica y sostenibilidad
      para este proyecto:

      ${context}
      `;

    }

    if (field === "productive_capacity") {

      prompt = `
      Calcula y redacta una capacidad
      productiva estimada para:

      ${context}

      Redacta profesionalmente.
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

    return NextResponse.json({
      result:
        completion.choices[0].message.content,
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