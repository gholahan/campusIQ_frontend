import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Avatar, Stars } from '@/shared/components/ui';
import { useRef } from 'react';
import { fadeUp, staggerContainer } from '@/shared/animations/motion';

const FEATURES = [
  { icon: '🎯', title: 'Find Expert Tutors',      desc: 'Browse verified peer tutors by course, rating, availability, and hourly rate.' },
  { icon: '✦',  title: 'AI Academic Assistant',   desc: 'Get instant intelligent answers to your academic questions 24/7.'},
  { icon: '💬', title: 'Real-Time Collaboration', desc: 'Chat, share files, and solve problems together in one workspace.'             },
  { icon: '📅', title: 'Easy Scheduling',          desc: 'Book sessions instantly with live calendar availability.'                    },
  { icon: '📊', title: 'Track Progress',           desc: 'Monitor your learning history and growth over time.'                        },
  { icon: '⭐', title: 'Trusted Community',        desc: 'Every tutor is student-rated and verified by our team.'                     },
];

const TESTIMONIALS = [
  { text: 'CampusIQ completely changed how I study. I went from failing to first class.', name: 'Tunde Bakare',     role: 'CS · Year 2',      color: 'var(--accent)'   },
  { text: 'The AI assistant breaks down calculus better than lectures.',                  name: 'Blessing Eze',     role: 'Maths · Year 3',   color: 'var(--cgreen)'  },
  { text: 'Found a tutor in minutes. Smooth experience.',                                 name: 'Ifeoluwa Adeyemi', role: 'Biology · Year 1', color: 'var(--cpurple)' },
  { text: 'Very intuitive platform even as a foreign student.',                           name: 'Kwabena Mensah',   role: 'Engineering',      color: 'var(--corange)' },
];

const STATS = [
  { num: '2,400+',  label: 'Active Students'   },
  { num: '180+',    label: 'Expert Tutors'      },
  { num: '12,000+', label: 'Sessions Completed' },
  { num: '4.9★',    label: 'Average Rating'     },
];

function HeroOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/10 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 -left-32 w-72 h-72 rounded-full bg-[var(--accent2)]/10 blur-[90px]" />
      <div className="absolute top-1/4 -right-24 w-56 h-56 rounded-full bg-[var(--cpurple)]/10 blur-[80px]" />
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef  = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="relative min-h-[100svh] flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-16 pb-24"
      >
        <HeroOrbs />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center">

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold mb-8
                       border border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)]"
          >
            <span className="text-[var(--accent)]">✦</span> AI-Powered Learning Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display font-extrabold tracking-[-1.5px] leading-[1.08] text-[clamp(36px,6.5vw,76px)] max-w-4xl"
          >
            Learn Smarter with<br />
            <span className="gradient-text">Tutors&nbsp;+&nbsp;AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[var(--text2)] text-sm sm:text-base leading-relaxed"
          >
            Connect with verified peer tutors and get instant AI help — all in one platform built for African university students.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mt-8">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started Free
            </button>
            <button className="btn-secondary" onClick={() => navigate('/student/tutors')}>
              Browse Tutors
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-6 mt-16 pt-10 border-t border-[var(--border)] w-full max-w-2xl"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-xl sm:text-2xl text-[var(--text)]">{s.num}</div>
                <div className="text-xs text-[var(--text3)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
      </motion.section>

      {/* ── FEATURES ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest mb-3">
            Features
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold">
            Everything You Need
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-[var(--text2)] text-sm sm:text-base max-w-md mx-auto">
            One platform. All the tools to help you study better, connect faster, and perform your best.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="card p-6 cursor-default group"
            >
              <div className="text-2xl mb-4 transition-transform duration-200 group-hover:scale-110 origin-left">
                {f.icon}
              </div>
              <h3 className="font-bold text-[var(--text)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--text2)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg2)] border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest mb-3">
              Student Stories
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold">
              Loved by Students
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid gap-5 sm:grid-cols-2"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="card p-6 flex flex-col gap-4">
                <Stars rating={5} />
                <p className="text-sm text-[var(--text2)] leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  <Avatar name={t.name} color={t.color} size={36} />
                  <div>
                    <div className="font-semibold text-sm text-[var(--text)]">{t.name}</div>
                    <div className="text-xs text-[var(--text3)]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 sm:py-32 text-center px-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="w-[500px] h-[500px] rounded-full bg-[var(--accent)]/8 blur-[100px]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="relative z-10 max-w-xl mx-auto"
        >
          <motion.p variants={fadeUp} className="text-xs font-semibold text-[var(--accent)] uppercase tracking-widest mb-4">
            Get Started Today
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Ready to transform<br className="hidden sm:block" /> your learning?
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-[var(--text2)] text-sm sm:text-base">
            Join thousands of students already using CampusIQ to study smarter.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Create Free Account
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center text-xs text-[var(--text3)] bg-[var(--bg2)] border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <span className="font-display font-bold text-[var(--text2)]">CampusIQ</span>
          <span className="hidden sm:block text-[var(--border)]">|</span>
          <span>© 2026 CampusIQ. All rights reserved.</span>
          <span className="hidden sm:block text-[var(--border)]">|</span>
          <div className="flex gap-4">
            <button className="hover:text-[var(--text)] transition-colors bg-transparent border-none cursor-pointer text-xs text-[var(--text3)]">Privacy</button>
            <button className="hover:text-[var(--text)] transition-colors bg-transparent border-none cursor-pointer text-xs text-[var(--text3)]">Terms</button>
            <button className="hover:text-[var(--text)] transition-colors bg-transparent border-none cursor-pointer text-xs text-[var(--text3)]">Contact</button>
          </div>
        </div>
      </footer>

    </div>
  );
}