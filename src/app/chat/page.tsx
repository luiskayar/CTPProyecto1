'use client'

import { useState, type FormEvent } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          assistantId: 'asst_QkuymFjNjWH536lBwddvaAYw',
          model: 'gpt-4o-mini'
        }),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const data: Message = await response.json()
      setMessages([...updatedMessages, data])
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="bg-white shadow-md rounded-lg p-4 h-[600px] flex flex-col">
        <div className="flex-1 overflow-auto space-y-4 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-200'
              } max-w-[80%]`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-200 p-4 rounded-lg max-w-[80%]">
              Pensando...
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 p-2 border rounded-md"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-blue-300"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}