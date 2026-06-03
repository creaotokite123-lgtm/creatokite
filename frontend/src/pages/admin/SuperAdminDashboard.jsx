import { useState, useEffect } from 'react';
import { ecosystemAPI, adminAPI } from '../../api';
import { PageLoader, Btn, StatCard, Avatar, Input, Textarea } from '../../components/ui';
import toast from 'react-hot-toast';
import { Shield, Coins, AlertOctagon, Settings, Database, Activity, FileText, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const isSuper = user?.role === 'superadmin';

  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab control
  const [activeTab, setActiveTab] = useState('overview');

  // Activities state
  const [activities, setActivities] = useState([]);
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actType, setActType] = useState('daily');
  const [actXp, setActXp] = useState('30');
  const [actCoins, setActCoins] = useState('10');
  const [actBadge, setActBadge] = useState('');
  const [actUrl, setActUrl] = useState('');
  const [actIsChallenge, setActIsChallenge] = useState(false);
  const [actIsActive, setActIsActive] = useState(true);
  const [savingActivity, setSavingActivity] = useState(false);

  // Override form state
  const [overrideUserEmail, setOverrideUserEmail] = useState('');
  const [overrideXp, setOverrideXp] = useState('');
  const [overrideCoins, setOverrideCoins] = useState('');
  const [overrideRole, setOverrideRole] = useState('creator');
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [applyingOverride, setApplyingOverride] = useState(false);

  // Review states
  const [feedbackMap, setFeedbackMap] = useState({});
  const [ratingMap, setRatingMap] = useState({});
  const [xpMap, setXpMap] = useState({});
  const [coinsMap, setCoinsMap] = useState({});

  const fetchData = async () => {
    try {
      if (isSuper) {
        const [resStats, resSubs, resLogs] = await Promise.all([
          ecosystemAPI.getPlatformRevenue(),
          ecosystemAPI.getPendingSubmissions(),
          ecosystemAPI.getSystemLogs()
        ]);
        setStats(resStats.stats);
        setSubmissions(resSubs.submissions || []);
        setLogs(resLogs.logs || []);
      } else {
        const resSubs = await ecosystemAPI.getPendingSubmissions();
        setSubmissions(resSubs.submissions || []);
      }
    } catch (e) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await ecosystemAPI.getActivities();
      setActivities(res.activities || []);
    } catch (e) {
      toast.error('Failed to load activities');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (subId, status) => {
    const feedback = feedbackMap[subId] || '';
    if (status === 'rejected' && !feedback) {
      toast.error('Please provide a feedback note for rejection');
      return;
    }
    const rating = ratingMap[subId] || 5;
    const customXp = xpMap[subId] !== undefined ? xpMap[subId] : '';
    const customCoins = coinsMap[subId] !== undefined ? coinsMap[subId] : '';

    try {
      await ecosystemAPI.reviewSubmission(subId, {
        status,
        adminFeedback: feedback,
        rating,
        customXp: customXp || undefined,
        customCoins: customCoins || undefined
      });
      toast.success(`Submission ${status} successfully!`);
      // Update local list
      setSubmissions(prev => prev.filter(s => s._id !== subId));
      fetchData(); // reload statistics
    } catch(e) {
      toast.error(e.response?.data?.message || 'Failed to review submission');
    }
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideUserEmail) {
      toast.error('User email required');
      return;
    }
    setApplyingOverride(true);
    try {
      // Find user by email from all users first
      const usersRes = await adminAPI.users({ search: overrideUserEmail, limit: 1 });
      const target = usersRes.users?.[0];
      if (!target) {
        toast.error('User not found by that email');
        setApplyingOverride(false);
        return;
      }

      await ecosystemAPI.superadminOverride({
        userId: target._id,
        xp: overrideXp ? +overrideXp : undefined,
        coins: overrideCoins ? +overrideCoins : undefined,
        role: overrideRole || undefined,
        isBanned,
        banReason
      });

      toast.success(`Successfully updated override configs for ${target.displayName}!`);
      setOverrideUserEmail('');
      setOverrideXp('');
      setOverrideCoins('');
      setBanReason('');
      setIsBanned(false);
      fetchData();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Override error');
    } finally {
      setApplyingOverride(false);
    }
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await ecosystemAPI.deleteActivity(id);
      toast.success('Activity deleted successfully');
      fetchActivities();
    } catch (e) {
      toast.error('Failed to delete activity');
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    if (!actTitle || !actDesc || !actType) {
      toast.error('Title, description, and type are required');
      return;
    }
    setSavingActivity(true);
    const data = {
      title: actTitle,
      description: actDesc,
      type: actType,
      xpReward: actXp ? +actXp : 30,
      coinReward: actCoins ? +actCoins : 10,
      badgeReward: actBadge,
      targetUrl: actUrl,
      isChallenge: actIsChallenge,
      isActive: actIsActive
    };
    try {
      if (editingActivityId) {
        await ecosystemAPI.updateActivity(editingActivityId, data);
        toast.success('Activity updated successfully!');
      } else {
        await ecosystemAPI.createActivity(data);
        toast.success('Activity launched successfully!');
      }
      // Reset form
      setEditingActivityId(null);
      setActTitle('');
      setActDesc('');
      setActType('daily');
      setActXp('30');
      setActCoins('10');
      setActBadge('');
      setActUrl('');
      setActIsChallenge(false);
      setActIsActive(true);
      
      fetchActivities();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Failed to save activity');
    } finally {
      setSavingActivity(false);
    }
  };

  const startEditActivity = (act) => {
    setEditingActivityId(act._id);
    setActTitle(act.title || '');
    setActDesc(act.description || '');
    setActType(act.type || 'daily');
    setActXp(act.xpReward?.toString() || '30');
    setActCoins(act.coinReward?.toString() || '10');
    setActBadge(act.badgeReward || '');
    setActUrl(act.targetUrl || '');
    setActIsChallenge(!!act.isChallenge);
    setActIsActive(!!act.isActive);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header Banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(251,191,36,0.04))',
        border:'1px solid rgba(239,68,68,0.15)', borderRadius:16, padding:'22px 24px',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <Shield size={18} style={{ color: isSuper ? 'var(--rose)' : 'var(--gold)' }} />
            <h2 style={{ fontFamily:'var(--fd)', fontSize:18, fontWeight:800 }}>
              {isSuper ? 'SuperAdmin Control Center' : 'Activity & Verification Hub'}
            </h2>
            <span className="badge badge-gold">{isSuper ? 'ROOT ACCESS' : 'ADMIN PORTAL'}</span>
          </div>
          <p style={{ color:'var(--t2)', fontSize:13 }}>
            {isSuper 
              ? 'Direct systems override, logs audits, platform settings control, and billing/commissions tracking.'
              : 'Launch new activities, edit challenges, delete previous events, and verify pending creator submissions.'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards Grid (SuperAdmin Only) */}
      {isSuper && stats && (
        <div className="grid-4">
          <StatCard label="Total Budget Vol." value={`₹${(stats.totalSpent / 1000).toFixed(0)}K`} icon={Coins} color="var(--p2)" />
          <StatCard label="Platform 10% Fee" value={`₹${(stats.platformCommission / 1000).toFixed(1)}K`} icon={Shield} color="var(--acc2)" sub="Calculated Revenue" />
          <StatCard label="Active Campaigns" value={stats.activeCampaigns} icon={Activity} color="var(--gold)" />
          <StatCard label="Total User Count" value={stats.users?.totalUsers} icon={Database} color="var(--acc)" sub={`${stats.users?.creatorsCount} Creators / ${stats.users?.brandsCount} Brands`} />
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{ display:'flex', gap:6, borderBottom:'1px solid var(--border)', paddingBottom:10 }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`chip ${activeTab === 'overview' ? 'active' : ''}`}
          style={{ fontSize:12, padding:'8px 16px', borderRadius:8, display:'flex', alignItems:'center', gap:6 }}>
          <Shield size={14}/> {isSuper ? 'System Overview & Controls' : 'Submissions Verification'}
        </button>
        <button
          onClick={() => {
            setActiveTab('activities');
            fetchActivities();
          }}
          className={`chip ${activeTab === 'activities' ? 'active' : ''}`}
          style={{ fontSize:12, padding:'8px 16px', borderRadius:8, display:'flex', alignItems:'center', gap:6 }}>
          <Activity size={14}/> Activities Manager
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div style={{ display:'grid', gridTemplateColumns: isSuper ? '1fr 360px' : '1fr', gap:16, alignItems:'start' }}>
          
          {/* Left Area (Submissions and Audit Logs) */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Pending Submissions */}
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:13 }}>
                Pending Tasks Verification ({submissions.length})
              </div>
              {submissions.length === 0 ? (
                <p style={{ padding:28, textAlign:'center', color:'var(--t3)', fontSize:12 }}>
                  All activity submissions are caught up! 🎉
                </p>
              ) : (
                submissions.map(sub => (
                  <div key={sub._id} style={{ padding:16, borderBottom:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:10 }}>
                    <div className="flex-between">
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Avatar src={sub.creator?.avatar} name={sub.creator?.displayName} size={30} />
                        <div>
                          <div style={{ fontSize:12, fontWeight:700 }}>{sub.creator?.displayName}</div>
                          <div style={{ fontSize:10, color:'var(--t3)' }}>Niche: {sub.creator?.niche}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span className="badge badge-purple" style={{ fontSize:9 }}>{sub.activity?.type}</span>
                        <div style={{ fontSize:11, color:'var(--acc2)', fontWeight:600, marginTop:4 }}>+{sub.activity?.xpReward} XP</div>
                      </div>
                    </div>

                    <div style={{ fontSize:12, background:'var(--s2)', padding:10, borderRadius:6, border:'1px solid var(--border)' }}>
                      <div style={{ fontWeight:600, marginBottom:4 }}>Task: {sub.activity?.title}</div>
                      <div style={{ color:'var(--t2)' }}>{sub.submissionNote || 'No description note provided.'}</div>
                      {sub.submissionUrl && (
                        <div style={{ marginTop:6 }}>
                          🔗 <a href={sub.submissionUrl} target="_blank" rel="noopener noreferrer" style={{ color:'var(--p2)', textDecoration:'underline' }}>
                            View Submission Attachment
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions & Feedback */}
                    <div style={{ display:'flex', flexDirection:'column', gap:8, background:'rgba(255,255,255,0.02)', padding:10, borderRadius:8, border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input className="form-input" style={{ flex:1, height:32, fontSize:11 }}
                          placeholder="Add administrative review notes..."
                          value={feedbackMap[sub._id] || ''}
                          onChange={e => setFeedbackMap(prev => ({ ...prev, [sub._id]: e.target.value }))} />
                      </div>

                      <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <span style={{ fontSize:10, color:'var(--t2)' }}>Rating:</span>
                            <select className="form-input" style={{ width:110, height:28, fontSize:10, padding:'0 4px' }}
                              value={ratingMap[sub._id] || 5}
                              onChange={e => setRatingMap(prev => ({ ...prev, [sub._id]: +e.target.value }))}>
                              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                              <option value={4}>⭐⭐⭐⭐ (4)</option>
                              <option value={3}>⭐⭐⭐ (3)</option>
                              <option value={2}>⭐⭐ (2)</option>
                              <option value={1}>⭐ (1)</option>
                            </select>
                          </div>

                          <input className="form-input" style={{ width:85, height:28, fontSize:10 }}
                            type="number"
                            placeholder={`XP (${sub.activity?.xpReward || 30})`}
                            value={xpMap[sub._id] || ''}
                            onChange={e => setXpMap(prev => ({ ...prev, [sub._id]: e.target.value }))} />

                          <input className="form-input" style={{ width:85, height:28, fontSize:10 }}
                            type="number"
                            placeholder={`Coins (${sub.activity?.coinReward || 10})`}
                            value={coinsMap[sub._id] || ''}
                            onChange={e => setCoinsMap(prev => ({ ...prev, [sub._id]: e.target.value }))} />
                        </div>

                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => handleReview(sub._id, 'approved')} className="btn btn-primary btn-sm" style={{ background:'var(--acc2)', height:28, display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                            <Check size={12}/> Approve
                          </button>
                          <button onClick={() => handleReview(sub._id, 'rejected')} className="btn btn-danger btn-sm" style={{ height:28, display:'flex', alignItems:'center', gap:4, fontSize:11 }}>
                            <X size={12}/> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* System logs (SuperAdmin Only) */}
            {isSuper && (
              <div className="card" style={{ padding:0, overflow:'hidden' }}>
                <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                  <FileText size={14}/> Audit Trail Logs
                </div>
                <div style={{ display:'flex', flexDirection:'column', maxHeight:300, overflowY:'auto' }}>
                  {logs.length === 0 ? (
                    <p style={{ padding:20, textAlign:'center', color:'var(--t3)', fontSize:12 }}>No logs generated yet.</p>
                  ) : (
                    logs.map(log => (
                      <div key={log._id} style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', fontSize:11, lineHeight:1.4 }}>
                        <div className="flex-between" style={{ marginBottom:3 }}>
                          <span style={{ fontWeight:700, color:'var(--p2)' }}>{log.action}</span>
                          <span style={{ color:'var(--t3)' }}>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div style={{ color:'var(--t2)' }}>{log.details}</div>
                        <div style={{ color:'var(--t3)', marginTop:2 }}>By: {log.performedBy?.displayName} ({log.performedBy?.email})</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Area (Override panel - SuperAdmin Only) */}
          {isSuper && (
            <div className="card">
              <h3 style={{ fontSize:13, fontWeight:700, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                <Settings size={14} /> Quick Override Engine
              </h3>
              <form onSubmit={handleOverrideSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <Input label="Target User Email"
                  value={overrideUserEmail} onChange={e => setOverrideUserEmail(e.target.value)}
                  placeholder="e.g. creator1@demo.com" required />
                
                <div className="grid-2" style={{ gap:12 }}>
                  <Input label="Set Total XP" type="number"
                    value={overrideXp} onChange={e => setOverrideXp(e.target.value)}
                    placeholder="e.g. 1500" />
                  <Input label="Set Coins" type="number"
                    value={overrideCoins} onChange={e => setOverrideCoins(e.target.value)}
                    placeholder="e.g. 500" />
                </div>

                <div className="form-group">
                  <label className="form-label">Change Role</label>
                  <select className="form-input" value={overrideRole} onChange={e => setOverrideRole(e.target.value)}>
                    <option value="creator">Creator</option>
                    <option value="brand">Brand</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">SuperAdmin</option>
                  </select>
                </div>

                {/* Account Ban control */}
                <div style={{ borderTop:'1px solid var(--border)', paddingTop:12, display:'flex', flexDirection:'column', gap:10 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                    <input type="checkbox" checked={isBanned} onChange={e => setIsBanned(e.target.checked)} />
                    <span style={{ fontSize:12, color:'var(--rose)', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
                      <AlertOctagon size={13}/> Suspend / Ban Account
                    </span>
                  </label>
                  
                  {isBanned && (
                    <Textarea label="Ban Justification Reason"
                      value={banReason} onChange={e => setBanReason(e.target.value)}
                      placeholder="State policy violation details..." />
                  )}
                </div>

                <Btn variant="primary" type="submit" disabled={applyingOverride} style={{ marginTop:8 }}>
                  {applyingOverride ? 'Applying...' : 'Apply Root Override'}
                </Btn>
              </form>
            </div>
          )}

        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16, alignItems:'start' }}>
          
          {/* Left Area (Activities List) */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:13 }}>
                Ecosystem Activities List ({activities.length})
              </div>
              {activities.length === 0 ? (
                <p style={{ padding:28, textAlign:'center', color:'var(--t3)', fontSize:12 }}>
                  No activities found. Use the panel on the right to launch one! 🚀
                </p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', maxHeight: 600, overflowY:'auto' }}>
                  {activities.map(act => (
                    <div key={act._id} style={{ padding:16, borderBottom:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:10 }}>
                      <div className="flex-between">
                        <div>
                          <span className="badge badge-purple" style={{ textTransform:'uppercase', fontSize:9, marginRight:6 }}>{act.type}</span>
                          {act.isChallenge && <span className="badge badge-gold" style={{ fontSize:9, marginRight:6 }}>CHALLENGE</span>}
                          {act.isActive ? (
                            <span className="badge badge-green" style={{ fontSize:9 }}>ACTIVE</span>
                          ) : (
                            <span className="badge badge-red" style={{ fontSize:9 }}>INACTIVE</span>
                          )}
                        </div>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={() => startEditActivity(act)} className="btn btn-ghost btn-sm" style={{ padding:'4px 8px', fontSize:11 }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteActivity(act._id)} className="btn btn-danger btn-sm" style={{ padding:'4px 8px', fontSize:11 }}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>{act.title}</h4>
                        <p style={{ fontSize:11, color:'var(--t2)', marginTop:4, lineHeight:1.5 }}>{act.description}</p>
                      </div>
                      <div style={{ display:'flex', gap:12, fontSize:11, fontWeight:600 }}>
                        <span style={{ color:'var(--p2)' }}>⚡ {act.xpReward} XP</span>
                        <span style={{ color:'var(--gold)' }}>🪙 {act.coinReward} Coins</span>
                        {act.badgeReward && <span style={{ color:'var(--acc2)' }}>🏆 Badge: {act.badgeReward}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area (Activity Edit/Create Form) */}
          <div className="card">
            <h3 style={{ fontSize:13, fontWeight:700, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
              {editingActivityId ? <Settings size={14} /> : <Activity size={14} />}
              {editingActivityId ? 'Edit Activity Details' : 'Launch New Activity'}
            </h3>
            <form onSubmit={handleActivitySubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <Input label="Activity Title"
                value={actTitle} onChange={e => setActTitle(e.target.value)}
                placeholder="e.g. Share your setup video" required />
              
              <Textarea label="Activity Description"
                value={actDesc} onChange={e => setActDesc(e.target.value)}
                placeholder="Explain what the creator needs to do to get rewards..." required />

              <div className="form-group">
                <label className="form-label">Activity Type</label>
                <select className="form-input" value={actType} onChange={e => setActType(e.target.value)}>
                  <option value="daily">Daily Activities</option>
                  <option value="weekly">Weekly Tasks</option>
                  <option value="monthly">Monthly Championships</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap:12 }}>
                <Input label="XP Reward" type="number"
                  value={actXp} onChange={e => setActXp(e.target.value)}
                  placeholder="e.g. 30" required />
                <Input label="Coin Reward" type="number"
                  value={actCoins} onChange={e => setActCoins(e.target.value)}
                  placeholder="e.g. 10" required />
              </div>

              <Input label="Badge Reward (Optional)"
                value={actBadge} onChange={e => setActBadge(e.target.value)}
                placeholder="e.g. Tech Guru (Creator badge name)" />

              <Input label="Target URL/Reference Link (Optional)"
                value={actUrl} onChange={e => setActUrl(e.target.value)}
                placeholder="https://..." />

              <div style={{ display:'flex', flexDirection:'column', gap:8, borderTop:'1px solid var(--border)', paddingTop:10 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={actIsChallenge} onChange={e => setActIsChallenge(e.target.checked)} />
                  <span style={{ fontSize:12, color:'var(--t1)' }}>Mark as Special Challenge</span>
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={actIsActive} onChange={e => setActIsActive(e.target.checked)} />
                  <span style={{ fontSize:12, color:'var(--t1)' }}>Activity is Active (Visible to Creators)</span>
                </label>
              </div>

              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                {editingActivityId && (
                  <Btn variant="ghost" type="button" onClick={() => {
                    setEditingActivityId(null);
                    setActTitle('');
                    setActDesc('');
                    setActType('daily');
                    setActXp('30');
                    setActCoins('10');
                    setActBadge('');
                    setActUrl('');
                    setActIsChallenge(false);
                    setActIsActive(true);
                  }} style={{ flex: 1 }}>
                    Cancel
                  </Btn>
                )}
                <Btn variant="primary" type="submit" disabled={savingActivity} style={{ flex: 2 }}>
                  {savingActivity ? 'Saving...' : editingActivityId ? 'Save Changes' : 'Launch Activity'}
                </Btn>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
