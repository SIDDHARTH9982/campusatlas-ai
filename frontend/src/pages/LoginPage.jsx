import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || null

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRedirect = (role) => {
    if (from) return from
    if (role === 'superadmin') return '/superadmin'
    if (role === 'institutionAdmin') return '/admin'
    return '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const data = await login(form)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`)
      navigate(getRedirect(data.user.role), { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CampusAtlas <span className="text-brand-400">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your CampusAtlas account</p>
        </div>

        <div className="surface p-8 shadow-glass">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="input-base"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 text-xs font-medium uppercase tracking-wide">Password</label>
                <button type="button" className="text-brand-400 text-xs hover:text-brand-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-base pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="remember-me" type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-brand-500" />
              <label htmlFor="remember-me" className="text-slate-400 text-sm">Remember me</label>
            </div>
            <button type="submit" disabled={loading} id="login-submit" className="btn-primary w-full justify-center text-base py-3">
              {loading ? <Spinner size="sm" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign up</Link>
            </p>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-slate-500 text-xs mb-2 font-medium">Demo credentials</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p><span className="text-slate-400">Super Admin:</span> admin@campusatlas.ai / Admin@123</p>
              <p><span className="text-slate-400">Inst. Admin:</span> admin@meridian.edu.in / Meridian@123</p>
              <p><span className="text-slate-400">Student:</span> rahul@student.com / Student@123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
