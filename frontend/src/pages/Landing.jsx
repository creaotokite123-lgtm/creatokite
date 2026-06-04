import FAQ from "../components/FAQ";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/* ══════════════════════════════════════════════════════════
   CREATOKITE V2 — Landing Page
   Design philosophy: "The platform matured. Same identity,
   premium execution." — Stripe/Linear level polish applied
   to the existing Creatokite brand.
══════════════════════════════════════════════════════════ */

/* ── Animated counter on scroll ─────────────────────────── */
function Counter({ end, suffix = '', prefix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      let cur = 0;
      const step = end / (duration / 16);
      const t = setInterval(() => {
        cur = Math.min(cur + step, end);
        setVal(Math.floor(cur));
        if (cur >= end) clearInterval(t);
      }, 16);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── Rotating word in hero ───────────────────────────────── */
const WORDS = ['Campaigns', 'Creators', 'ROI', 'Impact'];

/* ── How it works flow ───────────────────────────────────── */
const FLOW = [
  { n: '01', t: 'Brand Submits Brief',     d: 'Describe your goals, budget and audience. No creator browsing, no DMs, no spreadsheets.' },
  { n: '02', t: 'AI Analyzes & Matches',   d: 'Our AI scores 12,000+ creators on 12 parameters — niche, engagement quality, authenticity, growth.' },
  { n: '03', t: 'Admin Curates & Assigns', d: 'Our team reviews AI suggestions, finalizes the mix, and assigns creators to your campaign.' },
  { n: '04', t: 'Creators Execute',        d: 'Selected creators receive the brief, accept, create content, and submit through the platform.' },
  { n: '05', t: 'Live Analytics',          d: 'Real-time tracking with AI insights. We optimize mid-campaign for maximum ROI.' },
];

/* ── Platform features ───────────────────────────────────── */
const FEATURES = [
  { i: '🧠', t: 'AI Creator Matching',   d: '12-parameter scoring engine analyzes every creator for niche fit, engagement quality, audience authenticity, and ROI potential.', tag: 'Core AI',     wide: true },
  { i: '🛡️', t: 'Trust Score System',    d: 'Five-dimensional Trust Score. Fake follower detection, bot analysis, and delivery history built-in.',                           tag: 'Safety' },
  { i: '⚙️', t: 'Campaign OS',           d: 'Full workflow automation — brief to analytics. Admin assigns, creators execute, brands track.',                                 tag: 'Workflow' },
  { i: '💰', t: 'Escrow Payments',       d: 'Brand pays platform. Creator delivers. Admin approves. Auto-release. Zero fraud risk.',                                         tag: 'Payments' },
  { i: '🏆', t: 'Creator Gamification',  d: 'XP, levels, ranks, badges. Top creators get priority assignment to premium brand campaigns.',                                   tag: 'Growth' },
];

/* ── Platform info cards (help section) ─────────────────── */
const INFO_CARDS = [
  { icon: '⚡', title: 'How Activities Work', desc: 'Complete daily, weekly, and monthly activities to earn XP, Creator Coins, and badges. Every action builds your reputation.', bullets: ['Daily tasks refresh every 24 hours', 'Weekly challenges with higher XP rewards', 'Streak bonuses compound over time'] },
  { icon: '🏆', title: 'How Rankings Work',   desc: 'Your Creator Power Score (0–100) is calculated across influence, trust, campaign success, and activity — all combined.', bullets: ['8 separate leaderboards tracked', 'Rankings updated in near real-time', 'Higher score = better campaign selection'] },
  { icon: '🎓', title: 'How Academy Works',   desc: 'Complete courses in content creation, brand collaboration, and marketing. Each course earns you XP and official certificates.', bullets: ['10 creator-focused course categories', 'Certificates displayed on your profile', 'Academy XP boosts your Reputation Score'] },
  { icon: '🤝', title: 'How Brand Deals Work', desc: 'Brands never contact you directly. Our AI matches you based on your score, and admin assigns campaigns to qualifying creators.', bullets: ['Blind profile system protects your identity', 'Escrow payments guarantee your earnings', 'Higher Power Score = better campaigns'] },
];

/* ── Testimonials ────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Priya S.', handle: '@priya.creates', niche: 'Lifestyle', text: 'Creatokite changed how I approach content. The Academy courses helped me improve my engagement rate by 40%. Now I get consistent brand campaigns every month.', stat: '4 campaigns/month' },
  { name: 'Arjun M.', handle: '@arjunlifts',    niche: 'Fitness',   text: 'What I love most is the fairness. My follower count is moderate but my engagement is strong, and the AI recognizes that. I get campaigns bigger creators miss.', stat: '₹45,000 earned' },
  { name: 'Kavya R.', handle: '@kavya.food',    niche: 'Food',      text: 'The daily activities keep me motivated even between campaigns. The streak system is addictive in the best way — I haven\'t missed a day in 3 months.', stat: '87-day streak' },
];

/* ── Tutorial/walkthrough reels ─────────────────────────── */
const TUTORIALS = [
  { title: 'Complete Platform Walkthrough',    desc: 'Full tour of every feature — from profile setup to brand campaigns.',           duration: '8 min',  icon: '🗺️' },
  { title: 'How to Register & Get Verified',   desc: 'Step-by-step registration, profile completion, and approval process.',          duration: '4 min',  icon: '✅' },
  { title: 'Completing Activities for XP',     desc: 'How to find, complete, and submit daily and weekly activities.',                  duration: '5 min',  icon: '⚡' },
  { title: 'Understanding Your Creator Score', desc: 'What the Creator Power Score is, how it\'s calculated, and how to improve it.',  duration: '6 min',  icon: '📊' },
  { title: 'Academy: Courses & Certificates',  desc: 'Navigating the Academy, completing lessons, and earning certifications.',        duration: '7 min',  icon: '🎓' },
  { title: 'Becoming Eligible for Brand Deals',desc: 'Exactly what brands look for and how to optimize your profile for selection.',   duration: '9 min',  icon: '🤝' },
];

export default function Landing() {
  const nav = useNavigate();
  const { user } = useAuth();
  const dashboardPath = user ? `/${user.role}/dashboard` : null;
  const [wordIdx, setWordIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Rotating hero word
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  // Sticky nav + active section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      // Track active section
      const sections = ['how-it-works', 'features', 'testimonials', 'how-to-use', 'faq'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const NAV_LINKS = [
    { label: 'Features',  id: 'features' },
    { label: 'Activities',id: 'how-to-use' },
    { label: 'Rankings',  id: 'how-to-use' },
    { label: 'Academy',   id: 'how-to-use' },
    { label: 'FAQ',       id: 'faq' },
  ];

  return (
    <div style={{
      fontFamily: 'var(--fb)', color: 'var(--t1)',
      background: '#0F1117', minHeight: '100vh',
      overflowX: 'hidden',
      /* Force dark mode for landing page */
      '--bg': '#0F1117',
      '--t1': '#F0EDE6', '--t2': '#8892A4', '--t3': '#4A5568',
      '--s1': 'rgba(26,31,44,0.72)', '--s2': 'rgba(17,22,34,0.80)',
      '--border': 'rgba(255,255,255,0.07)', '--p': '#FF6B57', '--p2': '#FF856F',
      '--acc': '#7C8B5A', '--gold': '#D4A24C',
    }}>

      {/* ── NAVIGATION ─────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 60,
        background: scrolled ? 'rgba(12,14,20,0.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px,4vw,40px)',
        gap: 8,
        /* Offset for announcement strip */
        top: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            overflow: 'hidden', flexShrink: 0,
            border: '1px solid rgba(255,107,87,0.25)',
          }}>
            <img src="/logo.jpeg" alt="Creatokite" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{
            fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 15.5,
            letterSpacing: '-0.2px', color: 'var(--t1)',
          }}>
            Creatokite
          </span>
        </div>

        {/* Desktop nav links */}
        <div style={{
          display: 'flex', gap: 2, alignItems: 'center',
          // Hide on mobile
        }} className="hide-mobile">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 13px', borderRadius: 7, fontSize: 13,
              color: activeSection === l.id ? 'var(--t1)' : 'rgba(136,146,164,0.8)',
              fontWeight: activeSection === l.id ? 600 : 400,
              fontFamily: 'var(--fb)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--t1)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.target.style.color = activeSection === l.id ? 'var(--t1)' : 'rgba(136,146,164,0.8)'; e.target.style.background = 'none'; }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* CTA group */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
          {user ? (
            /* Logged in — profile chip that goes to dashboard */
            <button onClick={() => nav(dashboardPath)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 12px 5px 5px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 99,
              color: 'var(--t1)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', fontFamily: 'var(--fb)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,87,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,107,87,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              {/* Avatar circle */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--p)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.displayName?.[0] || user.email?.[0] || '?').toUpperCase()
                }
              </div>
              <span className="hide-mobile">{user.displayName?.split(' ')[0] || 'Dashboard'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ) : (
            <>
              <button onClick={() => nav('/login')} className="hide-mobile" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(136,146,164,0.85)', fontSize: 13, fontWeight: 500,
                padding: '7px 12px', borderRadius: 7, fontFamily: 'var(--fb)',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--t1)'}
              onMouseLeave={e => e.target.style.color = 'rgba(136,146,164,0.85)'}
              >
                Sign In
              </button>
              <button onClick={() => nav('/register')} style={{
                padding: '8px 18px',
                background: 'var(--p)',
                border: 'none', borderRadius: 8,
                color: '#fff', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', fontFamily: 'var(--fb)',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(255,107,87,0.30)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e85d45'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,107,87,0.40)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--p)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,87,0.30)'; }}
              >
                Get Started
              </button>
            </>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="show-mobile" style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: 'var(--t2)',
          }}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 999,
          background: 'rgba(12,14,20,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 20px 20px',
          animation: 'fadeIn 0.15s ease',
        }}>
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 0', fontSize: 15, color: 'var(--t2)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontFamily: 'var(--fb)',
            }}>
              {l.label}
            </button>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {user ? (
              <button onClick={() => { setMobileMenuOpen(false); nav(dashboardPath); }} style={{
                flex: 1, padding: '11px', borderRadius: 8,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--t1)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'var(--p)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff', overflow: 'hidden', flexShrink: 0,
                }}>
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user.displayName?.[0] || '?').toUpperCase()
                  }
                </div>
                {user.displayName?.split(' ')[0] || 'Dashboard'} →
              </button>
            ) : (
              <>
                <button onClick={() => nav('/login')} style={{
                  flex: 1, padding: '11px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--t1)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>Sign In</button>
                <button onClick={() => nav('/register')} style={{
                  flex: 1, padding: '11px', borderRadius: 8,
                  background: 'var(--p)', border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(100px,15vw,160px) clamp(20px,5vw,40px) 80px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        /* Account for nav only */
        paddingTop: 'clamp(100px,15vw,140px)',
      }}>
        {/* Subtle background gradient — not neon, just depth */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 60% at 50% 10%, rgba(255,107,87,0.065) 0%, transparent 65%)',
        }} />
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          {/* Category badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px 5px 8px',
            background: 'rgba(255,107,87,0.08)',
            border: '1px solid rgba(255,107,87,0.2)',
            borderRadius: 100, marginBottom: 32, fontSize: 12,
            color: 'rgba(255,133,111,0.9)',
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6,
              background: 'rgba(255,107,87,0.2)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11,
            }}>🇮🇳</span>
            India's First AI Creator Campaign Platform
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem,5.5vw,4rem)',
            fontFamily: 'var(--fd)', fontWeight: 900,
            lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1.5px',
            color: '#F0EDE6',
          }}>
            Intelligent{' '}
            <span style={{ position: 'relative', display: 'inline-block', minWidth: '3ch' }}>
              <span style={{
                color: 'var(--p)',
                transition: 'opacity 0.3s ease',
              }}>
                {WORDS[wordIdx]}
              </span>
            </span>
            <br />
            <span style={{ color: 'rgba(240,237,230,0.75)' }}>for Modern Brands</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(14px,2.2vw,17px)',
            color: 'rgba(136,146,164,0.95)',
            maxWidth: 500, margin: '0 auto 40px',
            lineHeight: 1.8, fontWeight: 400,
          }}>
            Brands submit goals. AI selects creators. Platform tracks everything.
            <br />
            <strong style={{ color: 'rgba(240,237,230,0.85)', fontWeight: 600 }}>No direct brand–creator contact. Just results.</strong>
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button onClick={() => nav('/register?role=brand')} style={{
              padding: '13px 26px',
              background: 'var(--p)',
              border: 'none', borderRadius: 9, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'var(--fb)', transition: 'all 0.2s',
              boxShadow: '0 6px 24px rgba(255,107,87,0.32)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,107,87,0.42)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,87,0.32)'; }}
            >
              🏢 Launch a Campaign
            </button>
            <button onClick={() => nav('/register?role=creator')} style={{
              padding: '13px 26px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 9, color: 'rgba(240,237,230,0.9)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              fontFamily: 'var(--fb)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              ✨ Join as Creator
            </button>
          </div>

          {/* Social proof metrics */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, overflow: 'hidden',
            maxWidth: 600, margin: '0 auto',
          }}>
            {[
              { l: 'Creators', v: 12000, s: '+',  c: '#FF856F' },
              { l: 'Campaigns', v: 847, s: '',    c: '#7C8B5A' },
              { l: 'Paid Out', v: 2,    s: 'Cr+', c: '#D4A24C', pre: '₹' },
              { l: 'Avg ROI',  v: 320,  s: '%',   c: '#8FBA74' },
            ].map(({ l, v, s, c, pre }, i) => (
              <div key={l} style={{
                padding: 'clamp(14px,3vw,20px) 12px', textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 'clamp(18px,3vw,22px)', color: c }}>
                  <Counter end={v} suffix={s} prefix={pre || ''} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(136,146,164,0.7)', marginTop: 4, letterSpacing: '0.05em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section id="how-it-works" style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: 'var(--p)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>The Workflow</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>
              How Creatokite Works
            </h2>
            <p style={{ color: 'rgba(136,146,164,0.8)', maxWidth: 380, margin: '12px auto 0', fontSize: 14 }}>
              Fully managed. Brands never contact creators directly.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 20, top: 24, bottom: 24,
              width: 1, background: 'linear-gradient(180deg,rgba(255,107,87,0.3),rgba(255,107,87,0.05))',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {FLOW.map((step, i) => (
                <div key={step.n} style={{
                  display: 'flex', gap: 20, paddingBottom: i < FLOW.length - 1 ? 28 : 0,
                  position: 'relative',
                }}>
                  {/* Step dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(255,107,87,0.1)',
                    border: '1px solid rgba(255,107,87,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: 'var(--p)',
                    fontFamily: 'var(--fd)', zIndex: 1,
                  }}>
                    {step.n}
                  </div>

                  <div style={{
                    flex: 1, paddingTop: 9,
                    paddingBottom: i < FLOW.length - 1 ? 0 : 0,
                  }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 5, fontFamily: 'var(--fd)' }}>{step.t}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(136,146,164,0.85)', lineHeight: 1.65 }}>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section id="features" style={{
        padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)',
        background: 'rgba(17,22,34,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: 'var(--p)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Platform Intelligence</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>
              Built for the Creator Economy
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={f.t}
                style={{
                  padding: 22, borderRadius: 12,
                  gridColumn: f.wide ? 'span 2' : '',
                  background: i === 0 ? 'rgba(255,107,87,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${i === 0 ? 'rgba(255,107,87,0.18)' : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,87,0.28)'; e.currentTarget.style.background = 'rgba(255,107,87,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = i === 0 ? 'rgba(255,107,87,0.18)' : 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = i === 0 ? 'rgba(255,107,87,0.04)' : 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{f.i}</span>
                  <span style={{
                    fontSize: 9, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.08em',
                    fontWeight: 700, textTransform: 'uppercase',
                    background: 'rgba(255,107,87,0.1)', color: 'rgba(255,133,111,0.9)',
                    border: '1px solid rgba(255,107,87,0.18)',
                  }}>{f.tag}</span>
                </div>
                <h3 style={{ fontSize: 14, fontFamily: 'var(--fd)', fontWeight: 700, marginBottom: 7, color: 'var(--t1)' }}>{f.t}</h3>
                <p style={{ fontSize: 12.5, color: 'rgba(136,146,164,0.85)', lineHeight: 1.65 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section id="testimonials" style={{ padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: 'var(--p)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Creator Stories</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>
              Creators who made it work
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                padding: 22, borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = ''; }}
              >
                {/* Stars */}
                <div style={{ fontSize: 11, color: '#D4A24C', marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: 13, color: 'rgba(136,146,164,0.9)', lineHeight: 1.7, marginBottom: 18 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'rgba(255,107,87,0.15)',
                      border: '1px solid rgba(255,107,87,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: 'var(--p)', fontFamily: 'var(--fd)',
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(136,146,164,0.6)' }}>{t.niche}</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                    background: 'rgba(124,139,90,0.12)', color: '#8FBA74',
                    border: '1px solid rgba(124,139,90,0.2)',
                  }}>
                    {t.stat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE / HELP CENTER ────────────────────── */}
      <section id="how-to-use" style={{
        padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)',
        background: 'rgba(17,22,34,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: 'var(--p)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Platform Guide</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', fontFamily: 'var(--fd)', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.5px' }}>
              New here? Learn how it works
            </h2>
            <p style={{ color: 'rgba(136,146,164,0.8)', maxWidth: 420, margin: '12px auto 0', fontSize: 14 }}>
              Everything you need to understand the platform before you start — no guesswork.
            </p>
          </div>

          {/* Info cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 12, marginBottom: 56 }}>
            {INFO_CARDS.map(card => (
              <div key={card.title} style={{
                padding: '20px 18px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,107,87,0.22)'; e.currentTarget.style.background = 'rgba(255,107,87,0.03)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 8, fontFamily: 'var(--fd)' }}>{card.title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(136,146,164,0.8)', lineHeight: 1.65, marginBottom: 14 }}>{card.desc}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {card.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
                      <span style={{ color: 'var(--p)', flexShrink: 0, marginTop: 2, fontSize: 11 }}>→</span>
                      <span style={{ fontSize: 11.5, color: 'rgba(136,146,164,0.75)', lineHeight: 1.5 }}>{b}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo('faq')} style={{
                  marginTop: 16, background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, fontSize: 12, color: 'rgba(255,107,87,0.8)',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                  fontFamily: 'var(--fb)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--p)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,107,87,0.8)'}
                >
                  Learn more in FAQ →
                </button>
              </div>
            ))}
          </div>

          {/* ── Tutorial walkthrough section ───────────── */}
          <div style={{
            padding: '32px 28px', borderRadius: 14,
            background: 'rgba(255,107,87,0.04)',
            border: '1px solid rgba(255,107,87,0.14)',
            marginBottom: 36,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>📱</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--fd)' }}>
                    Watch Step-by-Step Tutorials
                  </h3>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(136,146,164,0.85)' }}>
                  Screen recordings from our Instagram — see exactly how every feature works before you start.
                </p>
              </div>
              <a href="https://www.instagram.com/creatokite" target="_blank" rel="noreferrer" style={{
                padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(240,237,230,0.85)', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
              }}>
                📸 View All on Instagram
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
              {TUTORIALS.map((t) => (
                <div key={t.title} style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,107,87,0.1)', border: '1px solid rgba(255,107,87,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}>
                    {t.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--t1)', marginBottom: 3, lineHeight: 1.3 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(136,146,164,0.7)', lineHeight: 1.5, marginBottom: 8 }}>{t.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: 'rgba(136,146,164,0.5)' }}>⏱ {t.duration}</span>
                      <a href="https://www.instagram.com/creatokite" target="_blank" rel="noreferrer" style={{
                        fontSize: 10.5, fontWeight: 600, color: 'rgba(255,107,87,0.8)',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3,
                      }}>
                        Watch ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instagram CTA note */}
            <div style={{
              marginTop: 20, padding: '12px 16px', borderRadius: 9,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <p style={{ fontSize: 12, color: 'rgba(136,146,164,0.75)', lineHeight: 1.5 }}>
                All tutorials are available as Instagram Reels on{' '}
                <a href="https://www.instagram.com/creatokite" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--p)', textDecoration: 'none', fontWeight: 600 }}>
                  @creatokite
                </a>
                . Follow for new platform update videos and creator tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <FAQ />

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,107,87,0.06) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.7rem,4vw,2.6rem)',
            fontFamily: 'var(--fd)', fontWeight: 900, letterSpacing: '-0.8px',
            color: 'var(--t1)', lineHeight: 1.15, marginBottom: 14,
          }}>
            Ready to grow your creator career?
          </h2>
          <p style={{ color: 'rgba(136,146,164,0.85)', fontSize: 14, lineHeight: 1.75, marginBottom: 36 }}>
            Join thousands of creators building their reputation, learning new skills, and earning from brand campaigns — all in one platform.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/register?role=creator')} style={{
              padding: '13px 28px', background: 'var(--p)',
              border: 'none', borderRadius: 9, color: '#fff',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              fontFamily: 'var(--fb)', transition: 'all 0.2s',
              boxShadow: '0 6px 24px rgba(255,107,87,0.32)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(255,107,87,0.42)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,107,87,0.32)'; }}
            >
              Join as Creator — It's Free
            </button>
            <button onClick={() => nav('/register?role=brand')} style={{
              padding: '13px 28px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 9, color: 'rgba(240,237,230,0.85)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              fontFamily: 'var(--fb)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; }}
            >
              🏢 I'm a Brand
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: 'clamp(20px,4vw,28px) clamp(20px,5vw,40px)',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,107,87,0.2)' }}>
              <img src="/logo.jpeg" alt="Creatokite" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 13, color: 'var(--t1)' }}>Creatokite</span>
          </div>

          <div style={{ fontSize: 11, color: 'rgba(74,85,104,0.9)' }}>
            © 2025 Creatokite — AI-Powered Creator Platform · India
          </div>

          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} style={{
                fontSize: 11, color: 'rgba(74,85,104,0.9)', cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(136,146,164,0.9)'}
              onMouseLeave={e => e.target.style.color = 'rgba(74,85,104,0.9)'}
              >{l}</span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes pulse-dot { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @media (max-width: 600px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 601px) {
          .show-mobile { display: none !important; }
        }
        @media (max-width: 500px) {
          div[style*="gridTemplateColumns: 'repeat(4,1fr)'"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
