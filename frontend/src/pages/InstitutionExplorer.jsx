import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { institutionService, studentService } from '../services'
import { Building2, Search, MapPin, Filter, ArrowRight, CheckCircle2, Loader2, GraduationCap } from 'lucide-react'
import { Badge, EmptyState, Spinner } from '../components/ui'
import toast from 'react-hot-toast'

const typeColors = { university: 'blue', institute: 'green', college: 'amber', school: 'slate' }

export default function InstitutionExplorer() {
  const { user, hasPurchase, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [institutions, setInstitutions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selecting, setSelecting] = useState(null)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await institutionService.getActive()
        setInstitutions(data.institutions)
        setFiltered(data.institutions)
      } catch {
        toast.error('Failed to load institutions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = institutions
    if (search) result = result.filter(i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
      i.shortDescription?.toLowerCase().includes(search.toLowerCase())
    )
    if (typeFilter) result = result.filter(i => i.type === typeFilter)
    setFiltered(result)
  }, [search, typeFilter, institutions])

  const handleSelect = async (inst) => {
    if (!user) { navigate('/login'); return }
    if (!hasPurchase) { toast.error('Purchase access to select an institution'); return }
    setSelecting(inst._id)
    try {
      await studentService.selectInstitution(inst._id)
      toast.success(`${inst.name} selected!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.message || 'Failed to select institution')
    } finally {
      setSelecting(null)
    }
  }

  const handlePurchase = async () => {
    if (!user) { navigate('/signup'); return }
    setPurchasing(true)
    try {
      await studentService.purchaseAccess({ amount: 999, paymentMethod: 'demo', transactionId: `TXN_${Date.now()}` })
      await refreshUser()
      toast.success('Access purchased! You can now select any institution.')
    } catch (err) {
      toast.error(err?.message || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-slate-900/50 border-b border-slate-800 py-12">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-3">Institution Explorer</h1>
            <p className="text-slate-400 text-lg mb-8">Discover and connect with top schools, colleges, and universities. Pay once, access all.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, city, or keyword…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-base pl-10"
                />
              </div>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="input-base w-auto min-w-[160px]"
              >
                <option value="">All types</option>
                <option value="university">University</option>
                <option value="institute">Institute</option>
                <option value="college">College</option>
                <option value="school">School</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Purchase Banner */}
      {user && user.role === 'student' && !hasPurchase && (
        <div className="bg-brand-500/10 border-b border-brand-500/20">
          <div className="page-container py-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <p className="text-slate-300 text-sm"><strong className="text-white">Get full access</strong> — Select any institution and use AI chat for ₹999 one-time payment.</p>
            </div>
            <button onClick={handlePurchase} disabled={purchasing} className="btn-primary flex-shrink-0">
              {purchasing ? <Spinner size="sm" /> : <>Purchase access — ₹999 <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      )}

      <div className="page-container py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 text-sm">{filtered.length} institution{filtered.length !== 1 ? 's' : ''} found</p>
          {(search || typeFilter) && (
            <button onClick={() => { setSearch(''); setTypeFilter('') }} className="text-brand-400 text-sm hover:text-brand-300">Clear filters</button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Building2} title="No institutions found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((inst, i) => (
              <motion.div
                key={inst._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="surface hover:border-slate-600 transition-all group flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400 font-bold text-xl">
                      {inst.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-base leading-tight mb-1 truncate">{inst.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={typeColors[inst.type] || 'slate'} className="capitalize">{inst.type}</Badge>
                        {inst.admissionsOpen && <Badge variant="green">Admissions Open</Badge>}
                      </div>
                    </div>
                  </div>
                  {inst.location?.city && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {inst.location.city}, {inst.location.state}
                    </div>
                  )}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{inst.shortDescription}</p>
                  {inst.accreditation?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {inst.accreditation.slice(0, 2).map((acc, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">{acc}</span>
                      ))}
                    </div>
                  )}
                  {inst.established && (
                    <p className="text-slate-600 text-xs mt-3">Est. {inst.established}</p>
                  )}
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleSelect(inst)}
                    disabled={selecting === inst._id || (!hasPurchase && user?.role === 'student')}
                    id={`select-inst-${inst._id}`}
                    className={`w-full btn-primary justify-center group-hover:shadow-brand ${
                      (!hasPurchase && user?.role === 'student') ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''
                    }`}
                  >
                    {selecting === inst._id ? <Spinner size="sm" /> : (
                      <>
                        {!user ? 'Sign in to select' : !hasPurchase ? 'Purchase to select' : 'Select institution'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
