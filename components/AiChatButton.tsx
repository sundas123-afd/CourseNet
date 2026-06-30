"use client"

import { useState } from "react"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import AiChatBox from "./AiChatBox"

export default function AiChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false)

  const toggleChatBox = () => {
    setChatBoxOpen(!chatBoxOpen)
  }

  return (
    <>
      <Button
        onClick={toggleChatBox}
        size="icon"
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white z-50"
        aria-label={chatBoxOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        <Bot className="h-6 w-6" />
        <span className="sr-only">{chatBoxOpen ? "Close AI Chat" : "Open AI Chat"}</span>
      </Button>
      <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  )
}