import { motion } from 'framer-motion'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${sizes[size]} border-2 border-slate-700 border-t-brand-500 rounded-full animate-spin ${className}`} />
  )
}

export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-slate-800 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm">Loading CampusAtlas AI…</p>
    </div>
  </div>
)

export const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Spinner size="lg" />
  </div>
)

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
    )}
    <h3 className="text-slate-200 font-semibold text-lg mb-2">{title}</h3>
    {description && <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>}
    {action}
  </motion.div>
)

export const Badge = ({ children, variant = 'slate', className = '' }) => {
  const variants = {
    green: 'badge-green', blue: 'badge-blue', amber: 'badge-amber',
    red: 'badge-red', slate: 'badge-slate',
  }
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
}

export const StatCard = ({ label, value, sub, icon: Icon, accent = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="surface p-5 flex items-start gap-4"
  >
    {Icon && (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-brand-500/15' : 'bg-slate-800'}`}>
        <Icon className={`w-5 h-5 ${accent ? 'text-brand-400' : 'text-slate-400'}`} />
      </div>
    )}
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </motion.div>
)

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`relative w-full ${sizes[size]} surface shadow-glass max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  )
}

export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-slate-400 text-sm mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary">Cancel</button>
      <button onClick={onConfirm} disabled={loading} className="btn-primary bg-red-600 hover:bg-red-700 shadow-none">
        {loading ? <Spinner size="sm" /> : confirmLabel}
      </button>
    </div>
  </Modal>
)
