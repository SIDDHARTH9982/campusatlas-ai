import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, BookOpen, Building2, DollarSign, Users,
  Home, Bell, HelpCircle, Brain, Phone, GraduationCap,
  LogOut, Menu, ChevronRight, Globe, Truck, Library
} from 'lucide-react'

const nav = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/profile', icon: Building2, label: 'Institution Profile' },
  { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { href: '/admin/departments', icon: Users, label: 'Departments' },
  { href: '/admin/fees', icon: DollarSign, label: 'Fees' },
  { href: '/admin/scholarships', icon: GraduationCap, label: 'Scholarships' },
  { href: '/admin/hostel', icon: Home, label: 'Hostel & Mess' },
  { href: '/admin/placements', icon: Users, label: 'Placements' },
  { href: '/admin/notices', icon: Bell, label: 'Notices' },
  { href: '/admin/contacts', icon: Phone, label: 'Contacts' },
  { href: '/admin/transport', icon: Truck, label: 'Transport' },
  { href: '/admin/library', icon: Library, label: 'Library' },
  { href: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
  { href: '/admin/knowledge', icon: Brain, label: 'Knowledge Base' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (item) => item.exact ? location.pathname === item.href : location.pathname.startsWith(item.href)

  const handleLogout = async () => { await logout(); navigate('/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">CampusAtlas AI</p>
            <p className="text-slate-500 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(item => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${isActive(item) ? 'active' : ''}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button onClick={handleLogout} className="sidebar-link w-full text-slate-500 hover:text-red-400 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />Sign out
        </button>
      </div>
      <div className="p-3 m-2 mt-0 rounded-xl bg-slate-800/50 border border-slate-700">
        <p className="text-slate-200 text-sm font-medium truncate">{user?.name}</p>
        <p className="text-slate-500 text-xs mt-0.5">Institution Admin</p>
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
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
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
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span className="text-slate-300">Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-400">
              {nav.find(n => isActive(n))?.label || 'Overview'}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
