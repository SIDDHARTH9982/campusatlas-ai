import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 mt-24">
        <div className="page-container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="text-white font-bold">CampusAtlas AI</span>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
              <a href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
            </nav>
            <p className="text-slate-600 text-sm">© 2024 CampusAtlas AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
