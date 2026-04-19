import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { chatService, studentService } from '../services'
import { Send, Plus, MessageSquare, Zap, Loader2, Building2, ChevronDown, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { Spinner, ConfirmDialog } from '../components/ui'

export default function ChatPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  
  const [dashboard, setDashboard] = useState(null)
  const [sessions, setSessions] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [institutionName, setInstitutionName] = useState('')
  const [showConfirm, setShowConfirm] = useState(null)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending])

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashRes, sessRes] = await Promise.all([
          studentService.getDashboard(),
          chatService.getSessions()
        ])
        setDashboard(dashRes)
        setSessions(sessRes.sessions)
        setInstitutionName(dashRes.institution.name)
        
        if (sessionId) {
          const res = await chatService.getSession(sessionId)
          setMessages(res.messages)
        } else {
          setMessages([]) // wait for first message to create session
        }
      } catch (err) {
        if (err?.message?.includes('No institution selected')) {
          navigate('/institutions')
        } else {
          toast.error('Failed to load chat data')
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [sessionId, navigate])

  const handleNewChat = () => {
    setSearchParams({})
    setMessages([])
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleSelectSession = (id) => {
    setSearchParams({ session: id })
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  const handleDeleteSession = async (id) => {
    try {
      await chatService.deleteSession(id)
      setSessions(s => s.filter(x => x._id !== id))
      if (sessionId === id) handleNewChat()
      toast.success('Chat deleted')
    } catch {
      toast.error('Failed to delete chat')
    } finally {
      setShowConfirm(null)
    }
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || sending) return

    const userMessage = input.trim()
    setInput('')
    
    // Optimistic user message
    const tempId = Date.now().toString()
    setMessages(prev => [...prev, { _id: tempId, role: 'user', content: userMessage }])
    setSending(true)

    try {
      const res = await chatService.sendMessage({
        message: userMessage,
        sessionId: sessionId || undefined,
        institutionId: dashboard?.institution._id
      })
      
      if (!sessionId) {
        setSearchParams({ session: res.sessionId })
        // Refresh sessions list to show new session
        const sessRes = await chatService.getSessions()
        setSessions(sessRes.sessions)
      } else {
        // Just append the AI message
        setMessages(prev => [...prev, res.message])
      }
      
    } catch (err) {
      toast.error(err?.message || 'Failed to send message')
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m._id !== tempId))
    } finally {
      setSending(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSuggestion = (text) => {
    setInput(text)
    setTimeout(() => {
      // Create a synthetic event
      handleSend()
    }, 50)
  }

  if (loading) return <div className="h-[calc(100vh-56px)] flex items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="flex bg-slate-950 h-full relative" style={{ height: 'calc(100vh - 56px)' }}>
      
      {/* Sidebar for Sessions */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div 
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween', duration: 0.2 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] z-30 surface border-l-0 rounded-none lg:relative lg:flex lg:flex-col lg:z-10 flex-shrink-0"
            >
              <div className="p-4 border-b border-slate-800">
                <button onClick={handleNewChat} className="w-full btn-primary py-2.5 justify-center gap-2 shadow-none border border-brand-500/50">
                  <Plus className="w-4 h-4" /> New Chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="text-xs font-semibold text-slate-500 mb-3 px-2 uppercase tracking-wider">Chat History</p>
                {sessions.length === 0 ? (
                  <p className="text-slate-600 text-xs text-center py-4">No previous conversations</p>
                ) : (
                  sessions.map(s => (
                    <div key={s._id} className="group flex items-center relative rounded-lg hover:bg-slate-800/50 transition-colors">
                      <button 
                        onClick={() => handleSelectSession(s._id)}
                        className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left truncate rounded-lg text-sm transition-colors ${
                          sessionId === s._id ? 'bg-slate-800 text-brand-400' : 'text-slate-300'
                        }`}
                      >
                        <MessageSquare className={`w-4 h-4 flex-shrink-0 ${sessionId === s._id ? 'text-brand-400' : 'text-slate-500'}`} />
                        <span className="truncate">{s.title}</span>
                      </button>
                      <button 
                        onClick={() => setShowConfirm(s._id)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => handleDeleteSession(showConfirm)}
        title="Delete Conversation"
        message="Are you sure you want to delete this chat history? This action cannot be undone."
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        
        {/* Chat Header */}
        <div className="h-14 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-900/50 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="btn-ghost p-1.5 -ml-1.5 text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex flex-shrink-0 items-center justify-center">
                <Building2 className="w-4 h-4 text-brand-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-200 truncate">{institutionName}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>AI Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-brand-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">How can I help you?</h2>
              <p className="text-slate-400 text-sm mb-8">
                I'm your intelligent guide for <strong className="text-white">{institutionName}</strong>. 
                I can answer questions about admissions, fees, courses, placements, and more.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {[
                  "What is the fee structure for B.Tech CSE?",
                  "Tell me about the hostel facilities and fees.",
                  "What are the placement records for last year?",
                  "Are admissions open right now? What is the process?",
                ].map((sug, i) => (
                  <button 
                    key={i} onClick={() => handleSuggestion(sug)}
                    className="surface p-4 text-left text-sm text-slate-300 hover:border-brand-500/30 hover:bg-slate-800/50 transition-colors"
                  >
                    {sug} &rarr;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-20 space-y-6">
              {messages.map((msg, i) => (
                <div key={msg._id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                      <Zap className="w-4 h-4 text-brand-400" />
                    </div>
                  )}
                  <div className={`${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} overflow-hidden`}>
                    {msg.role === 'user' ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="prose prose-invert prose-chat max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <Zap className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="chat-bubble-ai flex items-center justify-center px-6">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 shrink-0 absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSend} className="relative flex items-end surface shadow-glass pl-4 pr-1.5 py-1.5 focus-within:border-brand-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about admissions, fees, courses..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 text-sm py-2.5 resize-none max-h-32 min-h-[44px]"
                rows={1}
                disabled={sending}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-colors flex-shrink-0 mb-0.5"
              >
                {sending ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-600">AI can make mistakes. Verify important information with the institution.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
