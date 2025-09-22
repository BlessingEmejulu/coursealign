'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Menu, 
  RotateCcw,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Paperclip,
  PenTool,
  FileText
} from 'lucide-react'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  lastActivity: Date
}

// Sample chat sessions data
const SAMPLE_CHAT_SESSIONS: ChatSession[] = [
  {
    id: '1',
    title: 'React Hooks Explanation',
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'Can you explain React hooks?',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '1-2',
        role: 'assistant',
        content: 'React hooks are functions that let you use state and other React features in functional components...',
        timestamp: new Date(Date.now() - 3500000)
      }
    ],
    lastActivity: new Date(Date.now() - 3500000)
  },
  {
    id: '2',
    title: 'Database Design Principles',
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'What are the key principles of database design?',
        timestamp: new Date(Date.now() - 7200000)
      }
    ],
    lastActivity: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    title: 'Algorithm Complexity',
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'Explain Big O notation',
        timestamp: new Date(Date.now() - 86400000)
      }
    ],
    lastActivity: new Date(Date.now() - 86400000)
  }
]

// Visual prompt cards for empty state (matching your design)
const VISUAL_PROMPTS = [
  {
    id: 1,
    title: 'Help me with an Assignment',
    description: 'Get assistance with your coursework',
    icon: PenTool,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 2,
    title: 'Generate keynotes for this course',
    description: 'Create study notes and summaries',
    icon: FileText,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    hoverColor: 'hover:bg-yellow-100'
  }
]

// Bottom action chips (matching your design)
const ACTION_CHIPS = [
  'summarized note...',
  'Possible Exam Questions'
]

export default function ChatPage() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  
  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(SAMPLE_CHAT_SESSIONS)
  const [currentSessionId, setCurrentSessionId] = useState<string>('current')
  const [showHistory, setShowHistory] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Input state
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Current session computed
  const currentSession = useMemo(() => {
    if (currentSessionId === 'current') {
      return {
        id: 'current',
        title: 'Current Chat',
        messages,
        lastActivity: new Date()
      }
    }
    return chatSessions.find(session => session.id === currentSessionId)
  }, [currentSessionId, chatSessions, messages])

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Chat session management
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastActivity: new Date()
    }
    setChatSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([])
    setShowHistory(false)
  }

  const switchToSession = (sessionId: string) => {
    if (sessionId === 'current') {
      setCurrentSessionId('current')
    } else {
      const session = chatSessions.find(s => s.id === sessionId)
      if (session) {
        setCurrentSessionId(sessionId)
        setMessages(session.messages)
      }
    }
    setShowHistory(false)
  }

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId))
    if (currentSessionId === sessionId) {
      setCurrentSessionId('current')
      setMessages([])
    }
  }

  const startEditingTitle = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId)
    setEditingTitle(currentTitle)
  }

  const saveTitle = (sessionId: string) => {
    if (editingTitle.trim()) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, title: editingTitle.trim() }
            : session
        )
      )
    }
    setEditingSessionId(null)
    setEditingTitle('')
  }

  const cancelEditing = () => {
    setEditingSessionId(null)
    setEditingTitle('')
  }

  // Message handling
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${userMessage.content}". This is a simulated response. In a real implementation, this would connect to an AI service to provide detailed explanations and help with your coursework.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleVisualPrompt = (prompt: any) => {
    setInputValue(prompt.title)
    textareaRef.current?.focus()
  }

  const handleActionChip = (chip: string) => {
    setInputValue(chip)
    textareaRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearCurrentChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Chat History Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showHistory ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* History Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
                aria-label="Close history"
              >
                ×
              </button>
            </div>
            
            <button
              onClick={createNewSession}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto">
            {/* Current Session */}
            <div
              onClick={() => switchToSession('current')}
              className={`group relative p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                currentSessionId === 'current' ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate ${
                    currentSessionId === 'current' ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    Current Chat
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {messages.length} messages • Active now
                  </p>
                </div>
                
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 ${
                  currentSessionId === 'current' ? 'bg-blue-400' : 'bg-gray-300'
                }`} />
              </div>
            </div>

            {/* Saved Sessions */}
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => switchToSession(session.id)}
                className={`group relative p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentSessionId === session.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingSessionId === session.id ? (
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveTitle(session.id)}
                        onBlur={() => saveTitle(session.id)}
                        className="text-sm font-medium w-full p-1 border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <h3 className={`text-sm font-medium truncate ${
                        currentSessionId === session.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {session.title}
                      </h3>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {session.messages.length} messages • {session.lastActivity.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ml-2 ${
                    currentSessionId === session.id ? 'bg-blue-400' : 'bg-gray-300'
                  }`} />
                </div>

                {/* Action buttons */}
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    {editingSessionId !== session.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditingTitle(session.id, session.title)
                        }}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        aria-label="Edit session title"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" />
                      </button>
                    )}
                    {editingSessionId !== session.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSession(session.id)
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        aria-label="Delete session"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile-First Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10" role="banner">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-4">
              {/* Mobile History Toggle */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Toggle chat history"
              >
                <MessageSquare className="w-6 h-6 text-gray-700" aria-hidden="true" />
              </button>

              {/* Desktop Hamburger Menu */}
              <button
                className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Open navigation menu"
                type="button"
              >
                <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
              </button>
              
              {/* Page Title */}
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-900">
                  Ask Me Anything
                </h1>
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={clearCurrentChat}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Clear current chat"
                title="Clear chat"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 max-w-sm mx-auto lg:max-w-4xl w-full flex flex-col">
          {/* Empty State with Visual Prompts */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col justify-center p-4 space-y-6">
              {/* Visual Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {VISUAL_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleVisualPrompt(prompt)}
                    className={`p-6 rounded-2xl border-2 ${prompt.bgColor} ${prompt.borderColor} ${prompt.hoverColor} transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`w-16 h-16 ${prompt.bgColor} rounded-xl flex items-center justify-center border ${prompt.borderColor}`}>
                        <prompt.icon className={`w-8 h-8 ${prompt.textColor}`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${prompt.textColor} text-sm leading-tight`}>
                          {prompt.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages for active conversations */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-600'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" aria-hidden="true" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Action Chips (only show when no messages) */}
          {messages.length === 0 && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {ACTION_CHIPS.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => handleActionChip(chip)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5 text-gray-500" aria-hidden="true" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                  rows={1}
                  disabled={isLoading}
                  aria-label="Type your message"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-2 p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Navigation (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">CA</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">CourseAlign</h1>
          </div>
          
          <nav className="space-y-2" role="navigation" aria-label="Main navigation">
            <Link href="/" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Home</span>
            </Link>
            <Link href="/course-outline" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-gray-600" />
              </div>
              <span>Course Outline</span>
            </Link>
            <Link href="/chat" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">Chat With AI</span>
            </Link>
            <Link href="/bookmarks" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Bookmarks</span>
            </Link>
            <Link href="/practice-exam" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="w-3 h-3 bg-gray-600 rounded"></span>
              </div>
              <span>Practice Exam</span>
            </Link>
          </nav>

          {/* Chat Info Panel */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">AI Assistant</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Ask me about programming, databases, algorithms, or any course topic. I'm here to help you learn!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
