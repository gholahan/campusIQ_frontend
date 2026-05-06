import { useNavigate } from 'react-router-dom';
import { Avatar, Stars } from '@/shared/components/ui';

const FEATURES = [
  { icon: '🎯', title: 'Find Expert Tutors',      desc: 'Browse verified peer tutors by course, rating, availability, and hourly rate.' },
  { icon: '✦',  title: 'AI Academic Assistant',   desc: 'Get instant intelligent answers to your academic questions 24/7, any time.' },
  { icon: '💬', title: 'Real-Time Collaboration', desc: 'Chat, share files, and work through problems together in real time.' },
  { icon: '📅', title: 'Easy Scheduling',         desc: 'Book sessions in seconds. View tutor availability and confirm instantly.' },
  { icon: '📊', title: 'Track Progress',          desc: 'Monitor your learning journey with session history and performance insights.' },
  { icon: '⭐', title: 'Trusted Community',       desc: 'Every tutor is rated by students. Read reviews, choose tutors you trust.' },
];
const TESTIMONIALS = [
  { text: 'CampusIQ completely changed how I study. My tutor walked me through data structures step by step — I went from failing to acing the exam.', name: 'Tunde Bakare',     role: 'CS Year 2',         color: 'var(--accent)' },
  { text: 'The AI assistant is incredible for late-night study sessions. It breaks down calculus concepts so clearly.',                                  name: 'Blessing Eze',     role: 'Maths Year 3',      color: 'var(--cgreen)' },
  { text: 'I found a chemistry tutor within minutes. The booking process is seamless and chat makes sessions feel natural.',                             name: 'Ifeoluwa Adeyemi', role: 'Bio-chem Year 1',    color: 'var(--cpurple)' },
  { text: 'As an international student it was hard finding help. CampusIQ connected me with tutors who speak my language of understanding.',             name: 'Kwabena Mensah',   role: 'Engineering Year 2', color: 'var(--corange)' },
  { text: "I became a tutor on this platform and it's been amazing. I help students, earn money, and reinforce my own understanding.",                   name: 'Amara Osei',       role: 'CS Tutor / PhD',     color: 'var(--accent2)' },
  { text: "The dashboard makes it so easy to track all my sessions. I know exactly what's covered and what's left to revise.",                          name: 'Ngozi Chibuike',   role: 'Physics Year 3',     color: 'var(--cred)' },
];
const STATS = [
  { num: '2,400+', label: 'Active Students' }, { num: '180+', label: 'Expert Tutors' },
  { num: '12,000+', label: 'Sessions Completed' }, { num: '4.9★', label: 'Average Rating' },
];

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="page-enter">
      {/* Hero */}
      <div className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold mb-7 text-[var(--accent2)]"
          style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          ✦ AI-Powered Learning Platform
        </div>
        <h1
          className="font-display font-extrabold leading-[1.05] mb-5 tracking-[-2px] text-[var(--text)]"
          style={{ fontSize: 'clamp(40px,7vw,76px)' }}
        >
          Learn Smarter with<br />
          <span className="gradient-text">Peer Tutors & AI</span>
        </h1>
        <p className="text-lg text-[var(--text2)] max-w-[560px] mx-auto mb-10 leading-relaxed">
          Connect with expert peer tutors, get instant AI academic help, and ace your courses — all in one modern platform.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-14">
          <button className="btn-primary text-[15px] px-7 py-3.5" onClick={() => navigate('/signup')}>Get Started Free →</button>
          <button className="btn-secondary text-[15px] px-7 py-3.5" onClick={() => navigate('/student/tutors')}>Browse Tutors</button>
        </div>
        <div className="flex flex-wrap gap-12 justify-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-[28px] font-extrabold text-[var(--text)]">{s.num}</div>
              <div className="text-[13px] text-[var(--text3)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6 max-w-[1100px] mx-auto">
        <h2 className="font-display text-[36px] font-extrabold text-center mb-3 tracking-[-1px] text-[var(--text)]">Everything You Need to Excel</h2>
        <p className="text-center text-[var(--text2)] text-base mb-14">One platform. Peer tutoring, AI assistance, and real-time collaboration.</p>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-4 bg-[var(--bg3)]">{f.icon}</div>
              <h3 className="font-display font-bold text-[17px] mb-3 text-[var(--text)]">{f.title}</h3>
              <p className="text-[var(--text2)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-6 max-w-[1100px] mx-auto">
        <h2 className="font-display text-[36px] font-extrabold text-center mb-3 tracking-[-1px] text-[var(--text)]">Loved by Students</h2>
        <p className="text-center text-[var(--text2)] text-base mb-14">Hear what students across campus are saying about CampusIQ.</p>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-6">
              <div className="text-[13px] mb-2"><Stars rating={5} /></div>
              <p className="text-[var(--text2)] text-sm leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2.5">
                <Avatar name={t.name} color={t.color} size={36} />
                <div>
                  <div className="font-semibold text-sm text-[var(--text)]">{t.name}</div>
                  <div className="text-xs text-[var(--text3)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-16 px-6 bg-[var(--bg3)] border-t border-[var(--border)]">
        <h2 className="font-display text-[36px] font-extrabold mb-3 tracking-[-1px] text-[var(--text)]">Ready to Transform Your Learning?</h2>
        <p className="text-[var(--text2)] mb-7 text-base">Join 2,400+ students already learning smarter on CampusIQ.</p>
        <button className="btn-primary text-[16px] px-8 py-4" onClick={() => navigate('/signup')}>Create Free Account →</button>
      </div>

      {/* Footer */}
      <footer className="py-10 px-8 text-center text-[13px] bg-[var(--bg3)] border-t border-[var(--border)] text-[var(--text3)]">
        <div className="mb-2">© 2026 CampusIQ — AI-Powered Campus Tutorial Support System</div>
        <div className="flex gap-5 justify-center flex-wrap">
          {['About','Tutors','Privacy','Terms','Contact'].map((l) => (
            <span key={l} className="cursor-pointer hover:text-[var(--text2)] transition-colors">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
