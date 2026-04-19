import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { studentService } from '../services'
import { PageLoader, Badge, EmptyState } from '../components/ui'
import { Bell, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NoticesPage() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getNotices()
        setNotices(res.notices)
      } catch {
        toast.error('Failed to load notices')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  const categoryBadge = { academic: 'blue', exam: 'amber', event: 'green', admission: 'blue', holiday: 'slate', general: 'slate' }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-shrink-0 items-center justify-center">
          <Bell className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">Institution Notices</h1>
          <p className="text-slate-400 text-sm">Stay updated with the latest announcements and events.</p>
        </div>
      </div>

      {notices.length === 0 ? (
        <EmptyState icon={Bell} title="No notices" description="There are no active notices from your institution at this time." />
      ) : (
        <div className="space-y-4">
          {notices.map((notice, i) => (
            <motion.div 
              key={notice._id} 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className={`surface p-6 ${notice.isPinned ? 'border-brand-500/30 bg-brand-500/5' : ''}`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {notice.isPinned && <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                    <Badge variant={categoryBadge[notice.category] || 'slate'} className="capitalize">{notice.category}</Badge>
                    {notice.priority === 'high' && <Badge variant="red">Urgent</Badge>}
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2">{notice.title}</h2>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                </div>
                <div className="sm:border-l sm:border-slate-800 sm:pl-6 sm:w-48 flex-shrink-0 flex flex-col justify-start">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                    <Calendar className="w-3.5 h-3.5" /> Published
                  </div>
                  <p className="text-slate-300 text-sm">
                    {new Date(notice.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
