'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { MessageCircle, Send, Shield, AlertTriangle, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SOSModal } from '@/components/sos-modal'
import { toast } from 'sonner'

const quickQuestions = [
  'Safety tips for night travel',
  'What to do if followed',
  'How to use SOS feature',
  'Safe commuting advice',
]

export default function ChatPage() {
  const [showSOSModal, setShowSOSModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialInput: '',
    onResponse: (response) => {
      // Check if help was requested
      if (response.headers.get('X-Help-Requested') === 'true') {
        toast.warning('Help Request Detected', {
          description: 'If you need immediate help, use the SOS button.',
          action: {
            label: 'SOS',
            onClick: () => setShowSOSModal(true),
          },
        })
      }
    },
    onError: () => {
      toast.error('Connection issue', {
        description: 'Please try again. If you need help, use the SOS button.',
      })
    },
  })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => {
      handleSubmit(fakeEvent)
    }, 100)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Check for help keyword
    if (input.toLowerCase().includes('help')) {
      setShowSOSModal(true)
    }

    handleSubmit(e)
  }

  return (
    <div className="flex flex-col h-[calc(100svh-120px)]">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Safety Chat</h1>
            <p className="text-sm text-muted-foreground">Ask me anything about safety</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-pink-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              How can I help you stay safe?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Ask me about safety tips, emergency procedures, or any concerns you have.
            </p>
            
            {/* Quick questions */}
            <div className="flex flex-wrap justify-center gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 rounded-xl bg-white/80 text-sm text-foreground hover:bg-white transition-colors border border-pink-100"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-tr-none'
                      : 'glass rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700">
                  Connection issue. Please try again.
                </p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-pink-100 bg-white/50 backdrop-blur-sm">
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={input ?? ''}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 h-12 rounded-xl bg-white border-pink-100 focus:border-pink-300 focus:ring-pink-200"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !(input ?? '').trim()}
            className="h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Type <span className="font-semibold text-red-500">&quot;help&quot;</span> for emergency SOS
        </p>
      </div>

      {/* SOS Modal */}
      <SOSModal isOpen={showSOSModal} onClose={() => setShowSOSModal(false)} />
    </div>
  )
}
