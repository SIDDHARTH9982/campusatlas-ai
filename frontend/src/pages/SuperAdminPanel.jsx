import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { superAdminService } from '../services'
import { PageLoader, StatCard, Badge, EmptyState } from '../components/ui'
import { 
  Building2, Users, DollarSign, Activity, 
  CheckCircle2, ChevronRight, MessageSquare, BarChart2,
  AlertCircle
} from 'lucide-react'
import { superAdminSchemas } from '../config/superAdminSchemas'
import AdminCRUD from '../components/AdminCRUD'
import toast from 'react-hot-toast'

export default function SuperAdminPanel() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)
  const isOverview = pathParts.length === 1 // Just /superadmin
  const moduleKey = pathParts[1] // e.g. 'institutions'
  const schema = superAdminSchemas[moduleKey]

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOverview) {
      loadAnalytics()
    }
  }, [isOverview])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const res = await superAdminService.getAnalytics()
      setData(res)
    } catch {
      toast.error('Failed to load super admin analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await superAdminService.updateStatus(id, status)
      toast.success('Institution status updated')
      loadAnalytics()
    } catch {
      toast.error('Failed to update status')
    }
  }

  // If we're on a sub-route and have a schema, show the dynamic CRUD view
  if (!isOverview && schema) {
    return <AdminCRUD schema={schema} />
  }

  // If we're on a sub-route but NO SCHEMA, show error
  if (!isOverview && !schema) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Module Under Construction</h2>
        <p className="text-slate-400 max-w-sm mb-8">This platform management module is not yet configured or is being updated.</p>
        <button onClick={() => window.history.back()} className="btn-secondary">Go Back</button>
      </div>
    )
  }

  // Default: Show Analytics Overview
  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Failed to load analytics" icon={Activity} />

  const { stats, recentInstitutions, recentPurchases } = data
  const statusColors = { pending: 'amber', active: 'green', inactive: 'slate', suspended: 'red' }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in h-screen overflow-y-auto custom-scrollbar pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        </div>
        <p className="text-slate-400 text-sm ml-11">Monitor platform growth, institutions, and overall revenue performance.</p>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard label="Total Inst." value={stats.totalInstitutions} icon={Building2} />
        <StatCard label="Active Inst." value={stats.activeInstitutions} icon={CheckCircle2} accent />
        <StatCard label="Students" value={stats.totalStudents} icon={Users} />
        <StatCard label="Purchases" value={stats.totalPurchases} icon={DollarSign} />
        <StatCard label="Revenue" value={`₹${(stats.revenue / 1000).toFixed(1)}k`} icon={Activity} accent />
        <StatCard label="AI Chats" value={stats.totalChats} icon={MessageSquare} />
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Institutions Table */}
        <div className="surface p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Recent Institutions</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentInstitutions.map(inst => (
                  <tr key={inst._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4 truncate max-w-[150px]">
                      <p className="font-medium text-slate-200">{inst.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{inst.type}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={statusColors[inst.status]}>{inst.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <select 
                        value={inst.status} 
                        onChange={(e) => handleStatusChange(inst._id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] uppercase font-bold tracking-tight rounded-lg px-2 py-1 outline-none focus:border-brand-500 transition-all cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchases Table */}
        <div className="surface p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Recent Sales</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentPurchases.map(p => (
                  <tr key={p._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-200 truncate">{p.userId?.name || 'Unknown User'}</p>
                      <p className="text-[10px] text-slate-500 lowercase">{p.userId?.email}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-emerald-400">₹{p.amount}</p>
                      <p className="text-[10px] text-slate-500">{new Date(p.purchasedAt).toLocaleDateString('en-IN')}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
