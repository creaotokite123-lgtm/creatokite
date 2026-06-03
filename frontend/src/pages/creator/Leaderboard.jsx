import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ecosystemAPI } from '../../api';
import { PageLoader, Avatar, Btn } from '../../components/ui';
import { Trophy, Shield, Zap, Sparkles, MessageSquare, BookOpen, Star, RefreshCw } from 'lucide-react';

const RANK_COLORS = { Bronze:'#cd7f32', Silver:'#c0c0c0', Gold:'var(--gold)', Platinum:'#a8d8ea', Diamond:'var(--p2)', Legend:'var(--acc)' };

const TABS = [
  { key: 'influence', label: '⭐ Influence', desc: 'Rank by followers, reach, and engagement' },
  { key: 'activity', label: '🏃 Activity', desc: 'Rank by total XP, activities completed, and streak milestones' },
  { key: 'campaign', label: '🎯 Campaigns', desc: 'Rank by campaign completion and brand review scores' },
  { key: 'reputation', label: '💎 Reputation', desc: 'Rank by campaign success, academy work, and community posts' },
  { key: 'trust', label: '🛡️ Trust Score', desc: 'Rank by deadline compliance, response time, and brand rates' },
  { key: 'academy', label: '🎓 Academy', desc: 'Rank by Academy XP and certificates unlocked' },
  { key: 'community', label: '💬 Community', desc: 'Rank by posts, replies, and community likes' },
  { key: 'referral', label: '👥 Referrals', desc: 'Rank by total referrals invited' },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [creators, setCreators] = useState([]);
  const [hof, setHof]             = useState(null);
  const [tab, setTab]             = useState('influence');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages]= useState(1);
  const [loading, setLoading]     = useState(true);

  const fetchLeaderboards = () => {
    setLoading(true);
    ecosystemAPI.getLeaderboards({ tab, page, limit: 10 })
      .then(d => {
        setCreators(d.creators || []);
        setTotalPages(d.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Load HOF once on mount
    ecosystemAPI.getHallOfFame()
      .then(d => setHof(d.hof || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchLeaderboards();
  }, [tab, page]);

  const selectTab = (tKey) => {
    setTab(tKey);
    setPage(1);
  };

  const getMetricDisplay = (c) => {
    if (tab === 'influence') return `${c.creatorScore || 0} Score`;
    if (tab === 'activity') return `${c.xp || 0} XP`;
    if (tab === 'campaign') return `${c.completedCampaigns || 0} Campaigns`;
    if (tab === 'reputation') return `${c.reputationScore || 0}% Rep`;
    if (tab === 'trust') return `${c.trustScore?.overall || 70}% Trust`;
    if (tab === 'academy') return `${c.academyXp || 0} XP`;
    if (tab === 'community') return `${c.communityXp || 0} XP`;
    if (tab === 'referral') return `${c.referralCount || 0} Invited`;
    return '';
  };

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Title */}
      <div className="flex-between">
        <div>
          <h2 style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:18, marginBottom:4 }}>🏆 Creatokite Leaderboards</h2>
          <p style={{ color:'var(--t2)', fontSize:13 }}>Compete with top creators, earn badges, and increase your campaign matching visibility!</p>
        </div>
      </div>

      {/* Hall of Fame Banner */}
      {hof && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:'var(--t3)', display:'flex', alignItems:'center', gap:5 }}>
            <Sparkles size={14} color="var(--gold)" /> Hall of Fame
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
            {[
              { title: 'Top Creator of Month', data: hof.topCreatorOfMonth, score: `${hof.topCreatorOfMonth?.reputationScore || 85}% Reputation`, icon: Star, color: 'var(--gold)' },
              { title: 'Highest XP Master', data: hof.topXP, score: `${hof.topXP?.xp || 0} XP`, icon: Zap, color: 'var(--p)' },
              { title: 'Most Trusted Creator', data: hof.topTrust, score: `${hof.topTrust?.trustScore?.overall || 70}% Trust`, icon: Shield, color: 'var(--acc2)' },
              { title: 'Campaign Champion', data: hof.topCampaigns, score: `${hof.topCampaigns?.completedCampaigns || 0} Campaigns`, icon: Trophy, color: 'var(--acc)' }
            ].map(({ title: t, data: d, score: sc, icon: Icon, color }) => d && (
              <div key={t} style={{
                background:'linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))',
                border:'1px solid var(--border)', borderRadius:12, padding:'14px 16px',
                display:'flex', alignItems:'center', gap:12
              }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${color}12`, display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>{t}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {d.displayName}
                  </div>
                  <div style={{ fontSize:11, color:color, fontWeight:600, marginTop:1 }}>{sc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Category Tabs */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, borderBottom:'1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => selectTab(t.key)}
            className={`chip${tab === t.key ? ' active' : ''}`}
            style={{ fontSize:12, padding:'8px 14px', borderRadius:8 }}>
            {t.label}
          </button>
        ))}
      </div>

      <p style={{ color:'var(--t2)', fontSize:11, marginTop:-10 }}>
        💡 {TABS.find(t => t.key === tab)?.desc}
      </p>

      {/* Main Leaderboard Table */}
      {loading ? (
        <PageLoader />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="card" style={{ padding:0, overflow:'hidden' }}>
            {creators.length === 0 ? (
              <div style={{ padding:32, textAlign:'center', color:'var(--t2)', fontSize:13 }}>No creators found.</div>
            ) : creators.map((c, i) => {
              const isMe = c._id === user?._id;
              const rc   = RANK_COLORS[c.rank] || 'var(--p2)';
              const globalRank = (page - 1) * 10 + i + 1;

              return (
                <div key={c._id} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                  borderBottom:'1px solid var(--border)',
                  background: isMe ? 'rgba(108,99,255,0.06)' : '',
                }}>
                  {/* Numerical dynamic Rank */}
                  <div style={{ width:28, textAlign:'center', fontFamily:'var(--fd)', fontWeight:800, fontSize:14,
                    color: globalRank===1?'var(--gold)':globalRank===2?'#c0c0c0':globalRank===3?'#cd7f32':'var(--t3)' }}>
                    {globalRank===1?'🥇':globalRank===2?'🥈':globalRank===3?'🥉':`#${globalRank}`}
                  </div>
                  
                  <Avatar src={c.avatar} name={c.displayName} size={38} />
                  
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2, display:'flex', alignItems:'center', gap:6 }}>
                      {c.displayName}
                      {isMe && <span className="badge badge-purple" style={{ fontSize:8 }}>You</span>}
                    </div>
                    <div style={{ fontSize:11, color:'var(--t2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {c.niche || 'General'} · Level {c.level||1} · {c.completedCampaigns||0} campaigns
                    </div>
                  </div>
                  
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:15, color:'var(--t1)' }}>
                      {getMetricDisplay(c)}
                    </div>
                    <div style={{ fontSize:10, color:rc, fontWeight:700, marginTop:2 }}>{c.rank}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display:'flex', justifyItems:'center', justifyContent:'center', gap:10, marginTop:8 }}>
              <Btn variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>
                Previous
              </Btn>
              <span style={{ fontSize:12, color:'var(--t2)', display:'flex', alignItems:'center' }}>
                Page {page} of {totalPages}
              </span>
              <Btn variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>
                Next
              </Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
