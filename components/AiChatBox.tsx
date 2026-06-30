"use client"

import { cn } from "@/lib/utils"
import { Bot, SendHorizontal, Trash, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

interface AiChatBoxProps {
  open: boolean
  onClose: () => void
}

export default function AiChatBox({ open, onClose }: AiChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      id: Date.now().toString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        id: (Date.now() + 1).toString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const clearMessages = () => {
    setMessages([])
    setError(null)
  }

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user"

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 w-full max-w-[420px] p-4",
        "sm:max-w-[380px] sm:right-4 sm:bottom-20",
        "md:max-w-[400px] md:right-4 md:bottom-20",
        "max-w-[calc(100vw-2rem)] right-2 bottom-20",
        open ? "block" : "hidden"
      )}
    >
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden" style={{height: '450px'}}>
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h2 className="text-sm sm:text-lg font-semibold">CourseNet AI</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            aria-label="Close chat"
            className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
          >
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        
        <div className="flex-grow p-3 sm:p-4 bg-gray-50 overflow-y-auto" ref={scrollRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.length === 0 && !error && (
              <div className="flex h-full flex-col items-center justify-center gap-3 sm:gap-4 text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm sm:text-lg font-semibold text-gray-800">Welcome to CourseNet AI!</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    Ask me anything about CourseNet platform, courses, or general questions
                  </p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage message={message} key={message.id} />
            ))}
            {isLoading && lastMessageIsUser && (
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] shadow-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="bg-red-50 text-red-800 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] border border-red-200">
                  <div className="text-xs sm:text-sm">{error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 sm:p-4 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearMessages}
              aria-label="Clear chat"
              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about CourseNet..."
              ref={inputRef}
              className="flex-1 border-gray-300 focus:border-blue-500 text-sm"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || input.length === 0}
              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <SendHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAiMessage = role === "assistant"

  return (
    <div
      className={cn(
        "mb-3 sm:mb-4 flex items-start gap-2 sm:gap-3",
        isAiMessage ? "justify-start" : "justify-end"
      )}
    >
      {isAiMessage && (
        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
      )}
      <div
        className={cn(
          "rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] shadow-sm",
          isAiMessage
            ? "bg-gray-100 text-gray-800 border border-gray-200"
            : "bg-blue-600 text-white"
        )}
      >
        <div className="text-xs sm:text-sm leading-relaxed">
          {content}
        </div>
      </div>
      {!isAiMessage && (
        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">You</span>
        </div>
      )}
    </div>
  )
}