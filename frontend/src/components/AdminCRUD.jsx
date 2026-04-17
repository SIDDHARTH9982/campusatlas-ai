import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { Spinner, EmptyState } from './ui'
import DynamicField from './ui/DynamicField'
import { Plus, Pencil, Trash2, X, Search, ChevronRight, Save, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCRUD({ schema }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [saving, setSaving] = useState(false)

  const { title, icon: Icon, apiPath, fields, columns } = schema

  useEffect(() => {
    fetchItems()
  }, [apiPath])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await api.get(apiPath)
      // Intelligent key detection (Admin uses 'data', Super Admin uses specific plural keys)
      const list = res.data || res.institutions || res.students || res.users || res.purchases || []
      setItems(list)
    } catch (err) {
      toast.error(`Failed to load ${title}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDrawer = (item = null) => {
    setEditingItem(item)
    setFormData(item || {})
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setEditingItem(null)
    setFormData({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingItem) {
        await api.put(`${apiPath}/${editingItem._id}`, formData)
        toast.success(`${title} updated`)
      } else {
        await api.post(apiPath, formData)
        toast.success(`New ${title} added`)
      }
      fetchItems()
      handleCloseDrawer()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await api.delete(`${apiPath}/${id}`)
      toast.success('Deleted successfully')
      fetchItems()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const filteredItems = items.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const formatValue = (val, type) => {
    if (type === 'currency') return `₹${Number(val).toLocaleString()}`
    if (type === 'date') return new Date(val).toLocaleDateString()
    return val
  }

  return (
    <div className="p-6 h-full flex flex-col animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
              <Icon className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-slate-400 text-sm ml-11">Manage and update your institution's {title.toLowerCase()}</p>
        </div>
        
        <button 
          onClick={() => handleOpenDrawer()}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-10"
          />
        </div>
        <div className="text-slate-500 text-xs font-medium">
          Showing {filteredItems.length} of {items.length} records
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            title={searchTerm ? "No matches found" : `No ${title} yet`} 
            icon={Icon} 
            description={searchTerm ? "Try adjusting your search" : `Get started by adding your first ${title.toLowerCase()} record.`}
          />
        ) : (
          <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 sticky top-0 z-10 border-b border-slate-800">
                  {columns.map((col, i) => (
                    <th key={i} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{col.header}</th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredItems.map(item => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={item._id} 
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-slate-300">
                        {formatValue(item[col.key], col.type)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenDrawer(item)}
                          className="p-1.5 rounded-md hover:bg-brand-500/10 hover:text-brand-400 text-slate-500 transition-all border border-transparent hover:border-brand-500/20"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-md hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 transition-all border border-transparent hover:border-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer (Right Panel) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{editingItem ? 'Edit' : 'Add New'} {title}</h2>
                  <p className="text-slate-500 text-xs">Fill in the details below</p>
                </div>
                <button onClick={handleCloseDrawer} className="p-2 rounded-lg hover:bg-slate-800 text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6 custom-scrollbar">
                {fields.map(field => (
                  <DynamicField 
                    key={field.name} 
                    field={field} 
                    value={formData[field.name]} 
                    onChange={handleChange} 
                  />
                ))}
              </form>

              <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleCloseDrawer}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-[2] btn-primary py-2.5"
                >
                  {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                  {editingItem ? 'Save Changes' : `Add ${title}`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
