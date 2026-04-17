import { useState, useEffect } from 'react'
import { superAdminService } from '../services'
import { PageLoader, StatCard, Badge, EmptyState } from '../components/ui'
import { Building2, Users, DollarSign, Activity, CheckCircle2, ChevronRight, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SuperAdminPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await superAdminService.getAnalytics()
        setData(res)
      } catch {
        toast.error('Failed to load super admin analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await superAdminService.updateStatus(id, status)
      toast.success('Institution status updated')
      const res = await superAdminService.getAnalytics()
      setData(res)
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <PageLoader />
  if (!data) return <EmptyState title="Failed to load" icon={Activity} />

  const { stats, recentInstitutions, recentPurchases } = data

  const statusColors = { pending: 'amber', active: 'green', inactive: 'slate', suspended: 'red' }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Platform Analytics</h1>
        <p className="text-slate-400 text-sm">Monitor platform growth, institutions, and revenue.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Inst." value={stats.totalInstitutions} icon={Building2} />
        <StatCard label="Active Inst." value={stats.activeInstitutions} icon={CheckCircle2} accent />
        <StatCard label="Students" value={stats.totalStudents} icon={Users} />
        <StatCard label="Purchases" value={stats.totalPurchases} icon={DollarSign} />
        <StatCard label="Revenue" value={`₹${(stats.revenue / 1000).toFixed(1)}k`} icon={Activity} accent />
        <StatCard label="AI Chats" value={stats.totalChats} icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="surface p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-shrink-0 items-center justify-center">
                <Building2 className="w-5 h-5 text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Recent Institutions</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInstitutions.map(inst => (
                  <tr key={inst._id}>
                    <td className="font-medium">{inst.name}</td>
                    <td className="capitalize text-slate-400">{inst.type}</td>
                    <td><Badge variant={statusColors[inst.status]}>{inst.status}</Badge></td>
                    <td>
                      <select 
                        value={inst.status} 
                        onChange={(e) => handleStatusChange(inst._id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-brand-500"
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

        <div className="surface p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-shrink-0 items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Recent Purchases</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map(p => (
                  <tr key={p._id}>
                    <td>
                      <p className="font-medium text-slate-200">{p.userId?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500">{p.userId?.email}</p>
                    </td>
                    <td className="font-medium text-emerald-400">₹{p.amount}</td>
                    <td className="text-slate-400 text-xs">{new Date(p.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                    <td><Badge variant={p.status === 'completed' ? 'green' : 'amber'}>{p.status}</Badge></td>
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
