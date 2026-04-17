import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminService } from '../services'
import { PageLoader, StatCard, EmptyState, Spinner } from '../components/ui'
import { BookOpen, Bell, HelpCircle, MessageSquare, Building2, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const load = async () => {
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
    load()
  }, [])

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

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Failed to load" icon={Building2} />

  const { stats } = data

  return (
    <div className="p-6 max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Institution Overview</h1>
        <p className="text-slate-400 text-sm">Manage your institution's profile and data categories.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Courses" value={stats.courseCount} icon={BookOpen} accent />
        <StatCard label="Active Notices" value={stats.noticeCount} icon={Bell} />
        <StatCard label="FAQs" value={stats.faqCount} icon={HelpCircle} />
        <StatCard label="Student Chats" value={stats.sessionCount} icon={MessageSquare} accent />
      </div>

      <div className="surface p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-shrink-0 items-center justify-center">
            <Building2 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Basic Profile</h2>
            <p className="text-slate-500 text-xs">Update your institution's core details</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Institution Name</label>
              <input name="name" value={profile.name || ''} onChange={handleChange} className="input-base" required />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Type</label>
              <select name="type" value={profile.type || ''} onChange={handleChange} className="input-base" required>
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="institute">Institute</option>
                <option value="school">School</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">City</label>
              <input name="location.city" value={profile.location?.city || ''} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">State</label>
              <input name="location.state" value={profile.location?.state || ''} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Email Address</label>
              <input name="email" type="email" value={profile.email || ''} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Phone Number</label>
              <input name="phone" value={profile.phone || ''} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Website</label>
              <input name="website" value={profile.website || ''} onChange={handleChange} className="input-base" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Established Year</label>
              <input name="established" type="number" value={profile.established || ''} onChange={handleChange} className="input-base" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Short Description</label>
              <input name="shortDescription" value={profile.shortDescription || ''} onChange={handleChange} className="input-base" maxLength={150} />
              <p className="text-slate-500 text-[10px] mt-1 text-right">{profile.shortDescription?.length || 0}/150</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Full Description (About)</label>
              <textarea name="description" value={profile.description || ''} onChange={handleChange} className="input-base resize-none" rows={4} />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
        <h3 className="text-amber-500 text-sm font-medium mb-1">To implement full CRUD for all categories:</h3>
        <p className="text-amber-400/80 text-xs">
          Each sidebar link under "Admin" uses the generic CRUD API endpoints we built on the backend.
          You would build generic table and form components to manage Courses, Fees, Placements etc.
        </p>
      </div>
    </div>
  )
}
