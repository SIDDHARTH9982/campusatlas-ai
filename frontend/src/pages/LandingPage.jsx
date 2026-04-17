import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  GraduationCap, MessageSquare, Building2, Users, CheckCircle2,
  ArrowRight, Zap, Shield, BarChart2, BookOpen, Star, ChevronDown
} from 'lucide-react'
import { useState } from 'react'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

const features = [
  { icon: Building2, title: 'Multi-Institution Access', desc: 'Students pay once and get access to all active institutions on the platform. Browse, search, and switch freely.' },
  { icon: MessageSquare, title: 'Institution-Scoped AI Chat', desc: 'The chatbot answers strictly from the selected institution\'s data. No hallucinations. No cross-institution leaks.' },
  { icon: Shield, title: 'Strict Data Isolation', desc: 'Every institution\'s data is fully isolated. Institution admins can only see their own data.' },
  { icon: BarChart2, title: 'Rich Knowledge Management', desc: 'Admins manage courses, fees, placements, hostel, FAQs, notices, faculty, and 15+ more categories.' },
  { icon: Zap, title: 'Instant Intelligent Answers', desc: 'Powered by Gemini AI. Handles Hinglish, spelling errors, and student-style questions with grace.' },
  { icon: BookOpen, title: 'Comprehensive Institution Profiles', desc: 'Each institution gets a full profile covering admissions, campus life, scholarships, library, transport, and more.' },
]

const steps = [
  { num: '01', title: 'Institution Onboards', desc: 'Institution purchases a plan. Super admin activates their account. Admin logs in and fills their profile.' },
  { num: '02', title: 'Admin Populates Data', desc: 'Institution admin fills courses, fees, placements, hostel details, notices, FAQs, and AI knowledge entries.' },
  { num: '03', title: 'Student Signs Up', desc: 'Student creates an account and makes a one-time payment to unlock access to all active institutions.' },
  { num: '04', title: 'Explore & Ask', desc: 'Student browses institutions, selects one, and gets instant AI-powered answers scoped to that institution.' },
]

const faqs = [
  { q: 'Do students need to pay separately for each institution?', a: 'No. Students make a single one-time payment and get access to all active institutions on the platform. No recurring fees, no per-institution charges.' },
  { q: 'Can institution admins see data from other institutions?', a: 'Absolutely not. Each institution admin can only access and manage their own institution\'s data. The platform enforces strict multi-tenant isolation.' },
  { q: 'How does the AI chatbot avoid mixing institution data?', a: 'When a student selects an institution, the AI is scoped exclusively to that institution\'s knowledge base. Every query fetches only that institution\'s data before generating a response.' },
  { q: 'What happens if the student switches institutions?', a: 'The student can switch institutions at any time from the explorer. The dashboard and chat immediately reload with the selected institution\'s data.' },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="page-container py-24 relative z-10">
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              The AI Platform Built for{' '}
              <span className="gradient-text">Education</span>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              CampusAtlas AI gives schools, colleges, and universities their own intelligent knowledge hub. Students pay once, explore all institutions, and get instant scoped answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-base px-7 py-3 shadow-brand">
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/institutions" className="btn-secondary text-base px-7 py-3">
                Explore institutions
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none z-10" />
            <div className="surface shadow-glass overflow-hidden">
              <div className="bg-slate-900 border-b border-slate-800 flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-slate-800 rounded-md px-4 py-1 text-slate-500 text-xs">campusatlas.ai/chat</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-0 h-72">
                <div className="col-span-1 bg-slate-900 border-r border-slate-800 p-3">
                  <div className="space-y-1">
                    {['Dashboard', 'AI Chat', 'Institutions', 'Notices'].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs ${i === 1 ? 'bg-brand-500/15 text-brand-400' : 'text-slate-500'}`}>
                        <div className="w-3 h-3 rounded bg-slate-700" />{item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-3 p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <div className="w-6 h-6 rounded bg-brand-500/20 flex items-center justify-center">
                      <GraduationCap className="w-3 h-3 text-brand-400" />
                    </div>
                    <span className="text-slate-300 text-xs font-medium">Meridian Institute of Technology</span>
                    <span className="ml-auto text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">Question</p>
                      <p className="text-slate-300 text-xs">What is the fee for B.Tech CSE?</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3 text-brand-400" /> CampusAtlas AI</p>
                    <p className="text-slate-300 text-xs leading-relaxed">The annual fee for <strong className="text-white">B.Tech CSE</strong> at Meridian Institute is <strong className="text-brand-400">₹1,85,000/year</strong>, which includes tuition (₹1,50,000), registration (₹10,000), exam (₹5,000), library (₹5,000), and sports fees (₹3,000).</p>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {['Admission dates', 'Hostel fees', 'Placement stats'].map((chip, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-slate-800 py-6">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
            {['NAAC Accredited Institutions', 'Gemini AI Powered', 'Multi-Tenant Isolated', 'One-Time Student Access', 'Real-Time Data Sync'].map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="page-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="section-title mb-4">Simple for institutions. Effortless for students.</h2>
            <p className="section-subtitle max-w-2xl mx-auto">The platform is built around two clear user journeys — institutions own their data, students access all of it.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="surface p-6 relative">
                <div className="text-5xl font-black text-slate-800 mb-4">{step.num}</div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900/30">
        <div className="page-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="section-title mb-4">Everything education institutions need</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="surface p-6 hover:border-brand-500/30 transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors">
                  <feat.icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits split */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="surface p-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">For Institutions</h3>
              <ul className="space-y-3">
                {[
                  'Full control over your institution\'s data and knowledge base',
                  'Manage 15+ data categories including courses, fees, placements',
                  'Dedicated AI chatbot trained exclusively on your institution\'s content',
                  'Students can find and connect with your institution through the explorer',
                  'Real-time notices, FAQs, and academic calendar management',
                  'Subscription plans to match institutions of any size',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
              <Link to="/signup?role=institutionAdmin" className="btn-secondary mt-8 w-full justify-center">Apply for your institution</Link>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }} className="surface p-8">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-4">For Students</h3>
              <ul className="space-y-3">
                {[
                  'One-time payment unlocks all active institutions on the platform',
                  'Browse and compare institutions side by side',
                  'Ask questions about admissions, fees, hostel, placements, and more',
                  'AI answers are always scoped to your selected institution',
                  'Switch between institutions at any time with full context reload',
                  'Save chat history and revisit answers anytime',
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />{b}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-primary mt-8 w-full justify-center shadow-brand">Get student access <ArrowRight className="w-4 h-4" /></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-slate-900/30">
        <div className="page-container text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-brand-400 font-medium text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="section-title mb-4">Transparent, simple pricing</h2>
            <p className="section-subtitle mb-8">Student one-time access from <strong className="text-white">₹999</strong>. Institution plans from <strong className="text-white">₹4,999/month</strong>.</p>
            <Link to="/pricing" className="btn-secondary">View full pricing →</Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="page-container max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-4">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="surface overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-slate-200 font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="page-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="surface max-w-3xl mx-auto text-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to transform campus communication?</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">Join forward-thinking institutions already using CampusAtlas AI to serve their students better.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="btn-primary text-base px-8 py-3 shadow-brand">Start free as a student <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/signup?role=institutionAdmin" className="btn-secondary text-base px-8 py-3">Apply as an institution</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
