import React from 'react'
import { motion } from 'framer-motion'

export default function DynamicField({ field, value, onChange }) {
  const { name, label, type, required, options, placeholder, rows } = field

  const baseClasses = "input-base w-full"
  
  if (type === 'textarea') {
    return (
      <div className="space-y-1.5">
        <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label} {required && '*'}</label>
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          rows={rows || 3}
          placeholder={placeholder}
          required={required}
          className={baseClasses + " resize-none"}
        />
      </div>
    )
  }

  if (type === 'select') {
    return (
      <div className="space-y-1.5">
        <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label} {required && '*'}</label>
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={(e) => onChange({ target: { name, value: e.target.checked } })}
          className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900"
        />
        <label className="text-sm font-medium text-slate-300">{label}</label>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label} {required && '*'}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={baseClasses}
      />
    </div>
  )
}
