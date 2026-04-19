import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { studentService } from '../services'
import {
  MessageSquare, Building2, Bell, BookOpen, DollarSign, Home,
  Briefcase, Phone, ArrowRight, Calendar, Users, TrendingUp
} from 'lucide-react'
import { Badge, EmptyState, StatCard, PageLoader } from '../components/ui'
import toast from 'react-hot-toast'

const quickActions = [
  { label: 'AI Chat', icon: MessageSquare, href: '/chat', color: 'text-brand-400', bg: 'bg-brand-500/10 border-brand-500/20' },
  { label: 'Courses', icon: BookOpen, href: '/chat', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Fees', icon: DollarSign, href: '/chat', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Hostel', icon: Home, href: '/chat', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { label: 'Placements', icon: Briefcase, href: '/chat', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { label: 'Contacts', icon: Phone, href: '/chat', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
]

const categoryBadge = { academic: 'blue', exam: 'amber', event: 'green', admission: 'blue', holiday: 'slate', general: 'slate' }

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getDashboard()
        setData(res)
      } catch (err) {
        if (err?.message?.includes('No institution selected')) {
          navigate('/institutions')
        } else {
          toast.error('Failed to load dashboard')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  if (loading) return <PageLoader />
  if (!data) return null

  const { institution, notices, courses, placements, recentChats } = data

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Institution header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-lg">
              {institution?.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{institution?.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm capitalize">{institution?.type}</span>
                {institution?.location?.city && <span className="text-slate-600 text-sm">· {institution.location.city}</span>}
              </div>
            </div>
          </div>
        </div>
        <Link to="/institutions" className="btn-secondary flex-shrink-0">
          <Building2 className="w-4 h-4" />Switch Institution
        </Link>
      </div>

      {/* Stats */}
      {placements && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Placement Rate" value={`${placements.placementRate}%`} icon={TrendingUp} accent />
          <StatCard label="Avg. Package" value={`₹${placements.averagePackage} LPA`} icon={Briefcase} />
          <StatCard label="Top Package" value={`₹${placements.highestPackage} LPA`} icon={TrendingUp} />
          <StatCard label="Year" value={placements.year} icon={Calendar} />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wide">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(action => (
            <Link key={action.label} to={action.href} className="surface p-4 flex flex-col items-center gap-2 text-center hover:border-slate-600 transition-all group">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${action.bg} transition-transform group-hover:scale-110`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-slate-400 text-xs font-medium group-hover:text-slate-200 transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Latest Notices</h2>
            <Link to="/notices" className="text-brand-400 text-xs hover:text-brand-300">View all →</Link>
          </div>
          {notices?.length === 0 ? (
            <EmptyState icon={Bell} title="No notices" description="No notices have been posted yet." />
          ) : (
            <div className="space-y-3">
              {notices?.map(notice => (
                <motion.div key={notice._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="surface p-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {notice.isPinned && <span className="text-xs text-amber-400 font-medium">📌 Pinned</span>}
                        <Badge variant={categoryBadge[notice.category] || 'slate'} className="capitalize">{notice.category}</Badge>
                        {notice.priority === 'high' && <Badge variant="red">Urgent</Badge>}
                      </div>
                      <p className="text-slate-200 font-medium text-sm mb-1">{notice.title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{notice.content}</p>
                      <p className="text-slate-600 text-xs mt-2">{new Date(notice.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Courses teaser */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Courses</h2>
              <Link to="/chat" className="text-brand-400 text-xs hover:text-brand-300">Ask AI →</Link>
            </div>
            <div className="space-y-2">
              {courses?.slice(0, 4).map(course => (
                <div key={course._id} className="surface-sm px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm font-medium">{course.name}</p>
                    <p className="text-slate-600 text-xs">{course.level} · {course.duration}</p>
                  </div>
                  {course.fees > 0 && <span className="text-slate-500 text-xs">₹{(course.fees / 1000).toFixed(0)}K</span>}
                </div>
              ))}
              {courses?.length > 4 && (
                <Link to="/chat" className="block text-center text-brand-400 text-xs py-2 hover:text-brand-300">+{courses.length - 4} more — Ask AI</Link>
              )}
            </div>
          </div>

          {/* Recent chats */}
          {recentChats?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">Recent Chats</h2>
                <Link to="/chat" className="text-brand-400 text-xs hover:text-brand-300">Open →</Link>
              </div>
              <div className="space-y-2">
                {recentChats.map(chat => (
                  <Link key={chat._id} to={`/chat?session=${chat._id}`}
                    className="surface-sm px-4 py-3 flex items-center gap-3 hover:border-slate-600 transition-colors block">
                    <MessageSquare className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <span className="text-slate-400 text-xs truncate">{chat.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AI Chat CTA */}
          <Link to="/chat" className="surface p-5 block hover:border-brand-500/30 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/25 transition-colors">
                <MessageSquare className="w-4 h-4 text-brand-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Ask AI anything</p>
                <p className="text-slate-500 text-xs">About {institution?.name}</p>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Ask about admissions, fees, courses, hostel, placements, or anything else about this institution.</p>
            <div className="flex items-center gap-1.5 text-brand-400 text-xs mt-3 font-medium">Start chatting <ArrowRight className="w-3 h-3" /></div>
          </Link>
        </div>
      </div>
    </div>
  )
}
