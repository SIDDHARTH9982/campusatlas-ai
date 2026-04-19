import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Menu, X, GraduationCap, ChevronDown, LogOut, User, LayoutDashboard, MessageSquare } from 'lucide-react'
import NavHeader from './ui/NavHeader'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ]

  const getDashboardLink = () => {
    if (!user) return null
    if (user.role === 'superadmin') return { href: '/superadmin', label: 'Super Admin' }
    if (user.role === 'institutionAdmin') return { href: '/admin', label: 'Admin Panel' }
    return { href: '/dashboard', label: 'Dashboard' }
  }
  const dashLink = getDashboardLink()

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="page-container flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">CampusAtlas <span className="text-brand-400">AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center">
            <NavHeader links={navLinks} />
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                    <span className="text-brand-400 text-xs font-semibold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-slate-300 text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-2 w-52 surface-sm shadow-glass py-1 z-50"
                    >
                      {dashLink && (
                        <Link to={dashLink.href} onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 text-sm transition-colors">
                          <LayoutDashboard className="w-4 h-4" />{dashLink.label}
                        </Link>
                      )}
                      {user.role === 'student' && (
                        <Link to="/chat" onClick={() => setDropOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 text-sm transition-colors">
                          <MessageSquare className="w-4 h-4" />AI Chat
                        </Link>
                      )}
                      <div className="border-t border-slate-800 my-1" />
                      <button onClick={() => { logout(); setDropOpen(false) }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-slate-800 text-sm transition-colors">
                        <LogOut className="w-4 h-4" />Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Sign in</Link>
                <Link to="/signup" className="btn-primary">Get started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden btn-ghost p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-slate-800 overflow-hidden"
          >
            <div className="page-container py-4 flex flex-col gap-2">
              {navLinks.map(link => <a key={link.href} href={link.href} className="btn-ghost w-full justify-start">{link.label}</a>)}
              <div className="border-t border-slate-800 pt-3 mt-1 flex flex-col gap-2">
                {user ? (
                  <>
                    {dashLink && <Link to={dashLink.href} className="btn-secondary w-full">{dashLink.label}</Link>}
                    <button onClick={logout} className="btn-ghost text-red-400 w-full justify-start">Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full">Sign in</Link>
                    <Link to="/signup" className="btn-primary w-full">Get started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
