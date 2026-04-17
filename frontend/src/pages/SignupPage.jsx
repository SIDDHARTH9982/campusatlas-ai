import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, Building2, Users, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') === 'institutionAdmin' ? 'institutionAdmin' : 'student'

  const [role, setRole] = useState(defaultRole)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const data = await signup({ ...form, role })
      toast.success(`Account created! Welcome, ${data.user.name.split(' ')[0]}!`)
      if (role === 'student') navigate('/institutions')
      else navigate('/admin')
    } catch (err) {
      toast.error(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">CampusAtlas <span className="text-brand-400">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-500 text-sm">Join the education intelligence platform</p>
        </div>

        <div className="surface p-8 shadow-glass">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-800/50 rounded-xl">
            {[
              { value: 'student', icon: Users, label: 'Student', sub: 'One-time access' },
              { value: 'institutionAdmin', icon: Building2, label: 'Institution', sub: 'Admin account' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRole(opt.value)}
                id={`role-${opt.value}`}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg text-sm font-medium transition-all ${
                  role === opt.value
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <opt.icon className="w-4 h-4" />
                <span>{opt.label}</span>
                <span className={`text-xs ${role === opt.value ? 'text-brand-200' : 'text-slate-600'}`}>{opt.sub}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {role === 'institutionAdmin' && (
              <motion.div
                key="inst-notice"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs leading-relaxed"
              >
                Institution accounts require approval by the platform admin. Your account will be reviewed and activated within 24 hours.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                {role === 'institutionAdmin' ? 'Admin Name' : 'Full Name'}
              </label>
              <input id="signup-name" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={role === 'institutionAdmin' ? 'Dr. Jane Smith' : 'Rahul Verma'} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Email Address</label>
              <input id="signup-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com" className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input id="signup-password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters" className="input-base pr-10" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {role === 'student' && (
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-2">
                <p className="text-slate-400 text-xs font-medium">After signup you'll:</p>
                {['Get access to all active institutions with one payment', 'Use AI chat scoped to your selected institution', 'Switch institutions anytime for free'].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-500 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{b}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" disabled={loading} id="signup-submit" className="btn-primary w-full justify-center text-base py-3 mt-2">
              {loading ? <Spinner size="sm" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm pt-6 border-t border-slate-800">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
