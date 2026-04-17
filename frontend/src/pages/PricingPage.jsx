import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Building2, Users, Zap } from 'lucide-react'

const institutionPlans = [
  {
    name: 'Starter', price: '₹4,999', period: '/month', highlight: false,
    desc: 'Perfect for small colleges and schools getting started.',
    features: ['Up to 500 students/month queries', '8 data categories', 'Basic AI chatbot', 'Standard support', '1 admin account', 'Notice management'],
  },
  {
    name: 'Growth', price: '₹9,999', period: '/month', highlight: true,
    desc: 'For growing institutions with multiple programs and departments.',
    features: ['Unlimited student queries', 'All 15+ data categories', 'Advanced AI chatbot', 'Priority support', '3 admin accounts', 'Analytics dashboard', 'Custom FAQ management', 'Placement records'],
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', highlight: false,
    desc: 'For large universities and multi-campus institutions.',
    features: ['Everything in Growth', 'Unlimited admin accounts', 'Dedicated support manager', 'Custom integrations', 'SLA guarantee', 'Onboarding assistance', 'API access', 'White-label options'],
  },
]

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="page-container">
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center mb-16">
          <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Simple Pricing</p>
          <h1 className="text-5xl font-bold text-white mb-5 tracking-tight">
            One product. <span className="gradient-text">Two customer types.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Institutions subscribe to manage their data. Students pay once to access everything.
          </p>
        </motion.div>

        {/* Institution Plans */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Institution Plans</h2>
              <p className="text-slate-500 text-sm">For schools, colleges, and universities</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {institutionPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`surface p-8 flex flex-col relative ${plan.highlight ? 'border-brand-500/40' : ''}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" />Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-slate-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup?role=institutionAdmin"
                  className={plan.highlight ? 'btn-primary w-full justify-center shadow-brand' : 'btn-secondary w-full justify-center'}
                >
                  {plan.price === 'Custom' ? 'Contact sales' : 'Get started'} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Student pricing */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Student Access</h2>
              <p className="text-slate-500 text-sm">For students exploring institutions</p>
            </div>
          </div>
          <div className="surface p-8 border-brand-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black text-white">₹999</span>
                  <span className="text-brand-400 font-semibold text-lg">one-time</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">Pay once. Access everything. Forever.</p>
                <ul className="space-y-2">
                  {[
                    'Instant access to all active institutions',
                    'Unlimited AI chat queries',
                    'Switch institutions anytime — no extra cost',
                    'Access to new institutions added in the future',
                    'Chat history and saved conversations',
                    'Permanent account — no subscription required',
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:w-56 flex-shrink-0 flex flex-col items-center gap-4 p-6 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                <div className="text-center">
                  <p className="text-slate-300 text-sm font-medium mb-1">No recurring fees</p>
                  <p className="text-slate-500 text-xs">Your access never expires</p>
                </div>
                <Link to="/signup" className="btn-primary w-full justify-center shadow-brand">
                  Get access <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-slate-600 text-xs text-center">Secure payment. Instant activation.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-16 text-center p-12 surface relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/8 to-transparent pointer-events-none" />
          <h3 className="text-white text-2xl font-bold mb-3 relative z-10">Need a custom plan?</h3>
          <p className="text-slate-400 mb-6 relative z-10">For large universities, state boards, or education groups — we'll build a plan around your needs.</p>
          <a href="mailto:sales@campusatlas.ai" className="btn-secondary relative z-10">Talk to our team →</a>
        </motion.div>
      </div>
    </div>
  )
}
