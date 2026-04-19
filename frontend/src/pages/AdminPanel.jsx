import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { adminService } from '../services'
import { PageLoader, StatCard, EmptyState, Spinner } from '../components/ui'
import { BookOpen, Bell, HelpCircle, MessageSquare, Building2, Save, LayoutDashboard } from 'lucide-react'
import { adminSchemas } from '../config/adminSchemas'
import AdminCRUD from '../components/AdminCRUD'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const isOverview = pathParts.length === 1 // Just /admin
  const isProfile = pathParts[1] === 'profile'
  const moduleKey = pathParts[1] // e.g. 'courses'
  const schema = adminSchemas[moduleKey]

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({})

  useEffect(() => {
    if (isOverview || isProfile) {
      loadOverview()
    }
  }, [isOverview, isProfile])

  const loadOverview = async () => {
    setLoading(true)
    try {
      const res = await adminService.getOverview()
      setData(res)
      setProfile(res.institution)
    } catch {
      toast.error('Failed to load admin overview')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.updateProfile(profile)
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setProfile(p => ({ ...p, [parent]: { ...p[parent], [child]: value } }))
    } else {
      setProfile(p => ({ ...p, [name]: value }))
    }
  }

  // If we're on a sub-route and have a schema, show the CRUD view
  if (!isOverview && !isProfile && schema) {
    return <AdminCRUD schema={schema} />
  }

  // If it's a sub-route but we don't handle it
  if (!isOverview && !isProfile && !schema) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
          <HelpCircle className="w-10 h-10 text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Module Not Found</h2>
        <p className="text-slate-400 max-w-sm mb-8">The module you're looking for was moved or doesn't exist.</p>
        <button onClick={() => window.history.back()} className="btn-secondary">Go Back</button>
      </div>
    )
  }

  // Default: Show Overview or Profile Form
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Failed to load" icon={Building2} />

  const { stats } = data

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in h-full overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Institution Overview</h1>
        </div>
        <p className="text-slate-400 text-sm ml-11">Management dashboard for your institution's digital presence.</p>
      </div>

      {/* Stats Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Courses" value={stats.courseCount} icon={BookOpen} accent />
        <StatCard label="Active Notices" value={stats.noticeCount} icon={Bell} />
        <StatCard label="FAQs" value={stats.faqCount} icon={HelpCircle} />
        <StatCard label="Student Chats" value={stats.sessionCount} icon={MessageSquare} accent />
      </div>

      {/* Basic Profile Form */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="surface p-6 mb-8 border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-shrink-0 items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Basic Profile</h2>
            <p className="text-slate-500 text-xs">Update your institution's core details and identity</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Institution Name</label>
              <input name="name" value={profile.name || ''} onChange={handleChange} className="input-base" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Type</label>
              <select name="type" value={profile.type || ''} onChange={handleChange} className="input-base" required>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="institute">Institute</option>
                <option value="school">School</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">City</label>
              <input name="location.city" value={profile.location?.city || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">State</label>
              <input name="location.state" value={profile.location?.state || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Email Address</label>
              <input name="email" type="email" value={profile.email || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Phone Number</label>
              <input name="phone" value={profile.phone || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Website</label>
              <input name="website" value={profile.website || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Established Year</label>
              <input name="established" type="number" value={profile.established || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Short Description</label>
              <input name="shortDescription" value={profile.shortDescription || ''} onChange={handleChange} className="input-base" maxLength={150} />
              <p className="text-slate-500 text-[10px] mt-1 text-right">{profile.shortDescription?.length || 0}/150</p>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest">Full Description (About)</label>
              <textarea name="description" value={profile.description || ''} onChange={handleChange} className="input-base resize-none" rows={4} />
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t border-slate-800/50">
            <button type="submit" disabled={saving} className="btn-primary min-w-[140px] py-2.5">
              {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
