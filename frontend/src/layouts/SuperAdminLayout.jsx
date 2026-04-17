import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Building2, Users, DollarSign, BarChart2, GraduationCap, LogOut, Menu, ChevronRight } from 'lucide-react'

const nav = [
  { href: '/superadmin', icon: BarChart2, label: 'Analytics', exact: true },
  { href: '/superadmin/institutions', icon: Building2, label: 'Institutions' },
  { href: '/superadmin/students', icon: GraduationCap, label: 'Students' },
  { href: '/superadmin/purchases', icon: DollarSign, label: 'Purchases' },
  { href: '/superadmin/users', icon: Users, label: 'All Users' },
]

export default function SuperAdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isActive = (item) => item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">CampusAtlas AI</p>
            <p className="text-slate-500 text-xs">Super Admin</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => (
          <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)} className={`sidebar-link ${isActive(item) ? 'active' : ''}`}>
            <item.icon className="w-4 h-4" />{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={() => { logout(); navigate('/login') }} className="sidebar-link w-full text-slate-500 hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />Sign out
        </button>
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
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }} transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-slate-900 border-r border-slate-800 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-900/50 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-2"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span className="text-slate-300">Super Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">{nav.find(n => isActive(n))?.label || 'Analytics'}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
    </div>
  )
}
