import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, MessageSquare, Building2, Bell, LogOut,
  GraduationCap, Menu, X, ArrowLeftRight, ChevronRight
} from 'lucide-react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { href: '/institutions', icon: Building2, label: 'Institutions' },
  { href: '/notices', icon: Bell, label: 'Notices' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-base">CampusAtlas <span className="text-brand-400">AI</span></span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const active = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link to="/institutions" className="sidebar-link text-brand-400 hover:text-brand-300 hover:bg-brand-500/10">
          <ArrowLeftRight className="w-4 h-4" />Switch Institution
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full text-slate-500 hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />Sign out
        </button>
      </div>
      <div className="p-3 m-2 rounded-xl bg-slate-800/50 border border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-400 text-xs font-bold">{user?.name[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-slate-200 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-slate-900 border-r border-slate-800">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-slate-900 border-r border-slate-800 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-900/50 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span className="text-slate-300">Student</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-400 capitalize">{location.pathname.replace('/', '') || 'Dashboard'}</span>
            </div>
            <Link to="/institutions" className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch Institution</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
