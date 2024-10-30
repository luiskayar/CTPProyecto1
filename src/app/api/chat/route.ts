import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Verificamos que tengamos la clave API
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Falta la clave API de OpenAI')
    }

    // Creamos el thread y ejecutamos el asistente
    const thread = await openai.beta.threads.create()
    
    // Agregamos el mensaje del usuario al thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages[messages.length - 1].content
    })

    // Ejecutamos el asistente
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_QkuymFjNjWH536lBwddvaAYw"
    })

    // Esperamos la respuesta
    let responseMessage
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
      if (runStatus.status === 'completed') {
        const threadMessages = await openai.beta.threads.messages.list(thread.id)
        // Obtenemos el primer mensaje (el más reciente) y su contenido
        const assistantMessage = threadMessages.data[0]
        if (assistantMessage.role === 'assistant' && assistantMessage.content[0].type === 'text') {
          responseMessage = assistantMessage.content[0].text.value
          break
        }
      } else if (runStatus.status === 'failed') {
        throw new Error('Error en la ejecución del asistente')
      }
      // Esperamos 1 segundo antes de verificar de nuevo
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (!responseMessage) {
      throw new Error('No se recibió respuesta del asistente')
    }

    return NextResponse.json({
      role: 'assistant',
      content: responseMessage
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Error en el procesamiento de la solicitud' }, 
      { status: 500 }
    )
  }
}