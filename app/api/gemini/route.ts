import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { context } = await request.json()

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'SUA_CHAVE_GEMINI_AQUI') {
      return NextResponse.json({
        tip: 'Configure sua chave do Gemini no arquivo .env.local para receber dicas personalizadas!'
      })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    })

    const prompt = `Você é um mentor financeiro positivo e motivador do app ContaComigo.

Contexto do usuário: ${context}

Sua tarefa: Dê uma dica financeira curta (máximo 2 frases) que seja motivadora, prática e sem julgamentos. Responda APENAS com a dica, sem introduções ou explicações extras.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()?.trim()

    return NextResponse.json({
      tip: text || 'Continue assim! Cada centavo poupado é um passo para sua liberdade financeira.'
    })
  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({
      tip: 'Você está fazendo um ótimo trabalho. Mantenha o foco nas suas metas financeiras!'
    })
  }
}
