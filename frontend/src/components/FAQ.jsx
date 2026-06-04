import { useState, useRef, useEffect } from 'react';

/* ══════════════════════════════════════════════════════════
   CREATOKITE V2 — Comprehensive FAQ Component
   50+ questions, category filtering, search, accordion
══════════════════════════════════════════════════════════ */

const FAQ_CATEGORIES = [
  { id: 'start',     label: 'Getting Started', icon: '🚀' },
  { id: 'activities',label: 'Activities',      icon: '⚡' },
  { id: 'rankings',  label: 'Rankings',        icon: '🏆' },
  { id: 'academy',   label: 'Academy',         icon: '🎓' },
  { id: 'deals',     label: 'Brand Deals',     icon: '🤝' },
  { id: 'growth',    label: 'Creator Growth',  icon: '📈' },
  { id: 'payments',  label: 'Payments',        icon: '💰' },
  { id: 'support',   label: 'Support',         icon: '🛟' },
];

const FAQS = [
  // ── Getting Started ────────────────────────────────────
  { cat: 'start', q: 'What is Creatokite?', a: 'Creatokite is India\'s first AI-powered Creator Ecosystem Platform. It\'s not just a marketplace — it\'s a complete creator growth, learning, and reputation platform. Creators join to learn, participate in activities, build their reputation, and get matched with premium brand campaigns. Brands get curated, verified creators with real engagement.' },
  { cat: 'start', q: 'How does the platform work?', a: 'The process is simple: (1) You register and build your creator profile, (2) Complete daily and weekly activities to earn XP and grow your ranking, (3) Learn through our Academy to build skills, (4) As your Creator Power Score improves, you become eligible for brand campaigns, (5) Campaigns are assigned by our AI and admin team — brands never contact you directly.' },
  { cat: 'start', q: 'Who can join Creatokite?', a: 'Any content creator with an active Instagram, YouTube, or social media presence can join. Whether you have 1,000 or 1,000,000 followers — we evaluate creators based on engagement quality, content authenticity, and growth consistency — not just follower count.' },
  { cat: 'start', q: 'Is it free to join?', a: 'Yes, joining Creatokite as a creator is completely free. There are no subscription fees, no hidden charges. You earn rewards, XP, and payouts when you complete brand campaigns.' },
  { cat: 'start', q: 'How long does account approval take?', a: 'Creator profiles are reviewed within 24–72 hours. Our admin team verifies your social accounts, checks engagement authenticity, and ensures your profile meets platform standards. You\'ll receive a notification once approved.' },
  { cat: 'start', q: 'What do I need to get started?', a: 'You need: an active social media account (minimum 1,000 followers), an email address, and a completed profile with your niche, location, and platform links. The more complete your profile, the faster you\'ll get approved and the higher your initial score.' },
  { cat: 'start', q: 'Can beginners join?', a: 'Absolutely. We welcome creators at every stage. Beginners start at Level 1 (Beginner) and grow through our activity and academy systems. Consistent participation matters more than follower count. Many of our top-ranked creators started from zero on our platform.' },

  // ── Activities ──────────────────────────────────────────
  { cat: 'activities', q: 'What are Activities?', a: 'Activities are tasks and challenges you complete on Creatokite to earn XP (experience points), Creator Coins, and badges. They range from daily check-ins and profile updates to weekly content challenges and monthly competitions. Activities are the primary way to grow your ranking and stay active on the platform.' },
  { cat: 'activities', q: 'What types of activities are available?', a: 'We have four main activity types: Daily Activities (login, view lessons, profile updates — quick 5-minute tasks), Weekly Challenges (content challenges, community contributions, growth tasks), Monthly Competitions (major content competitions with higher rewards), and Special Events (seasonal challenges and brand-sponsored activities).' },
  { cat: 'activities', q: 'How do I earn XP from activities?', a: 'XP is awarded automatically for most activities upon completion. For activities requiring submission (like reel challenges), XP is granted after admin review and approval. Daily login = 5 XP, Standard activity = 30 XP, Weekly challenge = 100 XP, Monthly competition = 250 XP, Campaign completion = 300 XP.' },
  { cat: 'activities', q: 'How often are new activities released?', a: 'Daily activities refresh every 24 hours at midnight. Weekly challenges drop every Monday. Monthly competitions launch on the 1st of each month. Special events are announced in the Community section and via notifications.' },
  { cat: 'activities', q: 'What happens after I submit an activity?', a: 'For auto-complete activities, XP is granted instantly. For submission-based activities (reel uploads, content challenges), your submission enters a review queue. Our admin team reviews it within 24–48 hours. You\'ll receive a notification with the decision and any feedback. Approved submissions grant full XP; rejected submissions come with detailed feedback so you can improve.' },
  { cat: 'activities', q: 'My activity submission was rejected. What should I do?', a: 'Don\'t worry — rejections include specific feedback explaining exactly what didn\'t meet the requirements. Read the feedback carefully, make the necessary improvements, and resubmit. Multiple rejections won\'t penalize your score, but approved submissions will boost it significantly.' },
  { cat: 'activities', q: 'What is the streak system?', a: 'Your streak tracks consecutive days of activity on the platform. Logging in and completing at least one activity each day maintains your streak. Streak milestones (7, 30, 100, 365 days) unlock bonus XP rewards, exclusive badges, and Creator Coins. Missing a day resets your streak to zero, so consistency is key.' },

  // ── Rankings ────────────────────────────────────────────
  { cat: 'rankings', q: 'How does the ranking system work?', a: 'Creatokite uses multiple leaderboards — not just one. Your rankings are calculated across: Influence (followers + engagement), Activity (XP + streaks), Campaign Performance (completion rate + results), Trust Score (reliability + consistency), Reputation (composite of all factors), Academy (learning progress), Community (engagement quality), and Referrals. Each leaderboard reflects a different dimension of your creator quality.' },
  { cat: 'rankings', q: 'What is the Creator Power Score?', a: 'The Creator Power Score (0–100) is your main platform metric. It\'s calculated as: Followers 20% + Engagement Quality 20% + Trust Score 25% + Campaign Success Rate 25% + Activity Score 10%. This score is what brands primarily use when our AI recommends creators for campaigns.' },
  { cat: 'rankings', q: 'How can I improve my ranking quickly?', a: 'The fastest way to improve your ranking is: (1) Complete all available daily activities consistently — this builds both XP and streaks, (2) Finish Academy courses in your niche — Academy XP contributes to your Reputation Score, (3) Complete any assigned campaigns with high quality, (4) Participate in Community discussions, (5) Keep your profile 100% complete and verified. Brands favor creators who show consistent effort.' },
  { cat: 'rankings', q: 'Why did my ranking drop?', a: 'Rankings are dynamic and update regularly. Common reasons for drops: inactivity (other creators are participating while you\'re not), a campaign completion rate issue, a decrease in social media engagement metrics, or other creators simply outperforming you. The solution is consistent daily participation and quality content creation.' },
  { cat: 'rankings', q: 'How often are rankings updated?', a: 'Leaderboards are recalculated automatically. XP-based rankings update in near real-time after activity approvals. Social metrics (follower counts, engagement rates) sync periodically. Campaign performance rankings update after campaign completion reviews.' },
  { cat: 'rankings', q: 'What are the creator levels?', a: 'There are 8 creator levels based on total XP: Level 1 Beginner (0 XP), Level 2 Rising Creator (500 XP), Level 3 Skilled Creator (1,500 XP), Level 4 Influencer (3,500 XP), Level 5 Professional (7,000 XP), Level 6 Elite (13,000 XP), Level 7 Master Creator (22,000 XP), Level 8 Legend (35,000+ XP). Higher levels unlock better campaign opportunities and platform perks.' },
  { cat: 'rankings', q: 'What factors impact the Trust Score?', a: 'Trust Score (0–100) is based on: Campaign completion rate (30% weight), Brand feedback ratings (25%), Response speed to messages (15%), Platform verification status (10%), Account age and history (10%), Deadline compliance (10%). A high Trust Score significantly increases your chances of being selected for premium brand campaigns.' },

  // ── Academy ──────────────────────────────────────────────
  { cat: 'academy', q: 'What is the Creator Academy?', a: 'Creator Academy is Creatokite\'s built-in learning platform with curated courses designed specifically for creators and influencers. Topics include Instagram Growth, Content Creation, Reel Editing, Brand Collaboration, Negotiation, Personal Branding, Marketing Fundamentals, Communication Skills, and AI Tools for Creators.' },
  { cat: 'academy', q: 'Why should I complete Academy courses?', a: 'Academy completion directly improves your Reputation Score (10% weighting), awards significant XP and Creator Coins, and unlocks official certificates that display on your profile. Brands actively look for creators who have completed relevant certifications. It also genuinely makes you a better creator.' },
  { cat: 'academy', q: 'Does Academy progress affect my ranking?', a: 'Yes. Academy XP contributes to your overall XP and your Reputation Score. The Academy Leaderboard tracks creators by Academy XP. Completing all courses in a category earns you a certificate, which is displayed prominently on your profile and increases your Creator Power Score.' },
  { cat: 'academy', q: 'How do certifications work?', a: 'Completing all lessons in an Academy category earns you an official Creatokite certificate with a unique verification ID. Certificates are displayed on your creator profile, visible to brands during campaign selection. Current certifications available: Content Creator, Brand Collaboration, Video Editing, Social Media Marketing, and Personal Branding.' },
  { cat: 'academy', q: 'What lesson formats are available?', a: 'Academy lessons come in four formats: Video Lessons (watch and learn), Articles (read at your own pace), Quizzes (test your knowledge — need 60% to pass), and Assignments (practical tasks submitted for admin review). Each lesson type rewards different amounts of XP upon completion.' },
  { cat: 'academy', q: 'Are Academy courses free?', a: 'Core Academy courses are free for all registered creators. Some advanced premium courses may require Creator Coins (earned through platform activities) to unlock. We believe knowledge should be accessible to every creator regardless of campaign activity level.' },

  // ── Brand Deals ──────────────────────────────────────────
  { cat: 'deals', q: 'How do brand deals work on Creatokite?', a: 'Brand deals work through a fully managed system: Brands submit campaign briefs and budgets. Our AI matches creators based on 12+ parameters. Our admin team reviews and finalizes selections. Selected creators receive the brief, accept the campaign, create content, and submit through the platform. Brands never contact creators directly — Creatokite manages the entire workflow.' },
  { cat: 'deals', q: 'When will I become eligible for brand campaigns?', a: 'There is no fixed threshold, but practically: creators with a Creator Power Score above 40, a verified profile, at least one completed Academy course, consistent activity participation (30+ day streak helps), and a clean Trust Score typically start receiving campaign offers. Focus on building all these dimensions simultaneously.' },
  { cat: 'deals', q: 'I\'m registered but haven\'t received any campaign offers yet. Why?', a: 'This is completely normal for new creators. Campaign selection is competitive and based on your current Creator Power Score. The best action you can take: complete your profile 100%, participate in daily activities without missing a day, complete 2–3 Academy courses, engage in the Community section. Creators who are active on the platform consistently get selected over inactive ones with similar follower counts.' },
  { cat: 'deals', q: 'What do brands evaluate when selecting creators?', a: 'Brands see a blind profile (no personal details). They evaluate: Creator ID and niche category, Follower counts and growth rate, Engagement quality and authenticity, Trust Score, Creator Power Score, Campaign completion history, Academy certifications, and Content quality from past submissions. Personal information is only revealed to brands after both parties confirm the campaign.' },
  { cat: 'deals', q: 'How can I increase my chances of getting selected for campaigns?', a: 'The most effective strategies: (1) Maintain a high engagement rate on your social platforms, (2) Complete Academy certifications relevant to your niche, (3) Have a 100% completed, verified profile, (4) Maintain an active streak — brands favor consistently active creators, (5) Deliver any assigned campaigns with exceptional quality, (6) Build a strong Trust Score by always meeting deadlines and responding promptly.' },
  { cat: 'deals', q: 'Can I refuse a campaign offer?', a: 'Yes, you can decline campaign offers. However, declining campaigns repeatedly may affect your Trust Score. If you decline, it\'s best to provide a reason through the platform. Legitimate reasons (personal conflict with brand values, scheduling conflict) are always respected and won\'t negatively impact your score.' },
  { cat: 'deals', q: 'Why can\'t brands contact me directly?', a: 'This is a core feature of Creatokite, not a limitation. The blind system protects creators from being lowballed, bypassed, or exploited. It ensures fair, standardized compensation, prevents brands from building relationships that bypass the platform, and guarantees creator identity protection. Every transaction is fully managed and guaranteed through Creatokite.' },

  // ── Creator Growth ───────────────────────────────────────
  { cat: 'growth', q: 'How can I grow faster on the platform?', a: 'The creators who grow fastest share these habits: Never miss a daily activity (streak consistency compounds over time), Complete one Academy lesson every day, Participate in weekly challenges (these have higher XP rewards), Engage genuinely in the Community section (community XP contributes to your Reputation Score), Keep your social profiles actively growing — the platform syncs your metrics.' },
  { cat: 'growth', q: 'How do I attract better brand opportunities?', a: 'Better brand opportunities come from a higher Creator Power Score. Focus on: improving your social media engagement rate (quality over quantity), completing Academy certifications in your niche, building a high Trust Score through platform reliability, consistently delivering quality in any campaigns you receive, and maintaining an active profile with regular activity.' },
  { cat: 'growth', q: 'How important is consistency on this platform?', a: 'Consistency is the single most important factor on Creatokite. The ranking system is designed to reward consistent creators over those who are occasionally brilliant. A 100-day streak earns more XP bonus than almost anything else. Daily activity completion compounds over time. Brands specifically filter for consistently active creators when selecting for campaigns.' },
  { cat: 'growth', q: 'I\'m a beginner creator. What should I focus on first?', a: 'For beginners, we recommend this 30-day plan: Week 1 — Complete your profile 100%, connect all social accounts, complete 3 Academy lessons. Week 2 — Establish your daily activity routine, join Community discussions, complete your first weekly challenge. Week 3 — Aim for 2 Academy course completions, maintain daily streak. Week 4 — Engage with the leaderboard, identify areas where you rank and focus on improving those specific metrics.' },
  { cat: 'growth', q: 'What are Creator Coins and how do I use them?', a: 'Creator Coins are Creatokite\'s virtual currency earned through activities, Academy completion, referrals, and community engagement. They can be spent on Profile Boost (increase your visibility to brands), Featured Creator status, Premium Themes for your profile, Special Challenge entries, and Profile cosmetic upgrades. Coins expire after 12 months if unused.' },

  // ── Payments ─────────────────────────────────────────────
  { cat: 'payments', q: 'How are campaign payments processed?', a: 'Creatokite uses an escrow payment system. The brand deposits the full campaign budget into Creatokite escrow before any creator is assigned. When you complete and submit your deliverable, our admin team reviews it. Upon approval, payment is released to your Creatokite wallet within 24 hours. This guarantees creators are always paid for completed, approved work.' },
  { cat: 'payments', q: 'When are payouts processed?', a: 'Wallet payouts are processed every Monday and Thursday. The minimum payout amount is ₹500. Payouts are transferred to your registered bank account or UPI. First-time payouts may take an additional 2–3 business days for verification. Subsequent payouts are typically received within 24 hours of processing.' },
  { cat: 'payments', q: 'What payment methods are supported?', a: 'We currently support UPI, Bank Transfer (NEFT/IMPS), and Paytm wallet for creator payouts. We are working on adding more payout options. For brands, payments are accepted via all major methods including credit/debit cards, net banking, and UPI.' },
  { cat: 'payments', q: 'Are there any deductions from campaign payments?', a: 'Creatokite charges a small platform fee on campaign payouts to cover operations, payment processing, and platform maintenance. The exact percentage is displayed transparently in your campaign agreement before you accept any campaign. There are no hidden deductions.' },
  { cat: 'payments', q: 'What if a brand doesn\'t pay or cancels mid-campaign?', a: 'Because we use an escrow system, this scenario is protected. Brands must fund the escrow before any creator assignment. If a brand cancels after you\'ve started work, you\'re compensated proportionally based on completed deliverables. If they cancel before you start, you face no loss. The escrow model was designed specifically to protect creators.' },

  // ── Support ──────────────────────────────────────────────
  { cat: 'support', q: 'I forgot my password. How do I reset it?', a: 'Click "Sign In" on the homepage, then click "Forgot Password" below the login form. Enter your registered email address and you\'ll receive a password reset link within 2 minutes. Check your spam folder if it doesn\'t appear. If you still have issues, contact support through the Help section in your dashboard.' },
  { cat: 'support', q: 'My ranking doesn\'t seem to be updating correctly.', a: 'Rankings update after activity approvals and metric syncs. If you\'ve recently completed activities or campaigns, allow up to 2 hours for the leaderboard to reflect changes. If the issue persists after 24 hours, use the "Report Issue" option in your dashboard settings. Include your User ID and the specific leaderboard that seems incorrect.' },
  { cat: 'support', q: 'I submitted an activity but haven\'t received XP yet.', a: 'Auto-complete activities should grant XP instantly. Submission-based activities (reel challenges, assignments) require admin review which takes 24–48 hours. You can check the status of pending submissions in Activities → My Submissions. If a submission shows "Approved" but XP wasn\'t credited, contact support with the submission ID.' },
  { cat: 'support', q: 'How do I update my social media profile links?', a: 'Go to your Creator Dashboard → Profile → Social Accounts. Click "Edit" next to any platform and update your handle or URL. Profile changes are re-verified by our system within 12 hours. During re-verification, your social metrics may temporarily show cached data.' },
  { cat: 'support', q: 'My account shows as pending even after 72 hours.', a: 'If your account has been in review for more than 72 hours, contact our support team through the in-app Help chat or email creaotokite123@gmail.com with your registered email address and User ID. This is usually caused by a verification issue that our team can resolve manually within a few hours.' },
  { cat: 'support', q: 'How do I report a technical issue or bug?', a: 'Use the feedback button (thumbs down icon) available throughout the platform, or go to Settings → Report Issue. Please include: what you were trying to do, what happened instead, your device and browser, and any screenshots. We take all reports seriously and typically resolve major issues within 24 hours.' },
];

function FAQItem({ item, globalIndex, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      onClick={onToggle}
      style={{
        background: isOpen
          ? 'rgba(255,107,87,0.04)'
          : 'rgba(255,255,255,0.02)',
        border: isOpen
          ? '1px solid rgba(255,107,87,0.22)'
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!isOpen) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        }
      }}
      onMouseLeave={e => {
        if (!isOpen) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        }
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        gap: 14, padding: '16px 18px',
      }}>
        <span style={{
          flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
          background: isOpen ? 'var(--p)' : 'rgba(255,255,255,0.2)',
          marginTop: 7, transition: 'background 0.2s',
        }} />
        <span style={{
          flex: 1, fontSize: 13.5, fontWeight: 600,
          color: isOpen ? 'var(--t1)' : 'rgba(240,237,230,0.75)',
          lineHeight: 1.5, transition: 'color 0.2s',
          fontFamily: 'var(--fd)',
        }}>
          {item.q}
        </span>
        <span style={{
          flexShrink: 0, fontSize: 18, lineHeight: 1,
          color: isOpen ? 'var(--p)' : 'rgba(255,255,255,0.25)',
          transform: isOpen ? 'rotate(45deg)' : 'none',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
          marginTop: 1,
        }}>
          +
        </span>
      </div>

      <div style={{
        height: height, overflow: 'hidden',
        transition: 'height 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div ref={bodyRef} style={{ padding: '0 18px 16px 38px' }}>
          <p style={{
            fontSize: 13, color: 'rgba(136,146,164,0.95)',
            lineHeight: 1.75,
          }}>
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('start');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = FAQS.filter(f => {
    const matchesCat = search ? true : f.cat === activeCategory;
    const matchesSearch = !search || 
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  // Reset open item when filter changes
  useEffect(() => { setOpenIndex(null); }, [activeCategory, search]);

  return (
    <section
      id="faq"
      style={{
        padding: 'clamp(60px,8vw,100px) clamp(20px,5vw,40px)',
        background: 'var(--bg)',
        position: 'relative',
      }}
    >
      {/* Subtle divider line top */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%',
        height: 1, background: 'rgba(255,255,255,0.06)',
      }} />

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--p)',
            marginBottom: 14,
          }}>
            Frequently Asked Questions
          </div>
          <h2 style={{
            fontSize: 'clamp(1.7rem,4vw,2.5rem)',
            fontFamily: 'var(--fd)', fontWeight: 800,
            color: 'var(--t1)', lineHeight: 1.15,
            marginBottom: 14, letterSpacing: '-0.5px',
          }}>
            Everything you need to know
          </h2>
          <p style={{ color: 'rgba(136,146,164,0.9)', fontSize: 14, maxWidth: 400, margin: '0 auto 32px' }}>
            Can't find an answer?{' '}
            <a href="https://mail.google.com/mail/?view=cm&to=creaotokite123@gmail.com" target="_blank" rel="noreferrer" style={{
              color: 'var(--p)', cursor: 'pointer',
              borderBottom: '1px solid rgba(255,107,87,0.4)',
              textDecoration: 'none',
            }}>
              Contact our team.
            </a>
          </p>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto' }}>
            <svg style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', opacity: 0.35,
              pointerEvents: 'none',
            }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              style={{
                width: '100%', padding: '11px 14px 11px 40px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 10, color: 'var(--t1)', fontSize: 13,
                outline: 'none', transition: 'border-color 0.2s',
                fontFamily: 'var(--fb)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,107,87,0.4)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', color: 'rgba(136,146,164,0.6)',
                cursor: 'pointer', fontSize: 16, lineHeight: 1,
                padding: '2px 4px',
              }}>×</button>
            )}
          </div>
        </div>

        {/* Category filter tabs */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: 36,
        }}>
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: 'var(--fb)',
                background: activeCategory === cat.id
                  ? 'rgba(255,107,87,0.15)'
                  : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat.id ? 'var(--p)' : 'rgba(136,146,164,0.8)',
                border: activeCategory === cat.id
                  ? '1px solid rgba(255,107,87,0.3)'
                  : '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeCategory !== cat.id) { e.target.style.color = 'var(--t1)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}}
              onMouseLeave={e => { if (activeCategory !== cat.id) { e.target.style.color = 'rgba(136,146,164,0.8)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {search && (
          <div style={{
            fontSize: 12, color: 'rgba(136,146,164,0.6)',
            textAlign: 'center', marginBottom: 20,
          }}>
            {filtered.length} question{filtered.length !== 1 ? 's' : ''} found
            {search && <> for "<span style={{ color: 'var(--t2)' }}>{search}</span>"</>}
          </div>
        )}

        {/* FAQ List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(136,146,164,0.5)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
            <p style={{ fontSize: 14 }}>No questions match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('start'); }}
              style={{
                marginTop: 12, padding: '8px 16px', borderRadius: 8,
                background: 'rgba(255,107,87,0.1)', border: '1px solid rgba(255,107,87,0.25)',
                color: 'var(--p)', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((item, i) => (
              <FAQItem
                key={`${item.cat}-${i}`}
                item={item}
                globalIndex={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48, padding: '24px 28px',
          background: 'rgba(255,107,87,0.05)',
          border: '1px solid rgba(255,107,87,0.15)',
          borderRadius: 14, textAlign: 'center',
        }}>
          <p style={{ fontSize: 14, color: 'rgba(136,146,164,0.9)', marginBottom: 14 }}>
            Still have questions? Our team responds within 2 hours.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://mail.google.com/mail/?view=cm&to=creaotokite123@gmail.com" target="_blank" rel="noreferrer" style={{
              padding: '9px 20px', borderRadius: 9,
              background: 'rgba(255,107,87,0.12)',
              border: '1px solid rgba(255,107,87,0.28)',
              color: 'var(--p)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              ✉ Email Support
            </a>
            <a href="https://instagram.com/creatokite" target="_blank" rel="noreferrer" style={{
              padding: '9px 20px', borderRadius: 9,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(136,146,164,0.9)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}>
              📸 Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
