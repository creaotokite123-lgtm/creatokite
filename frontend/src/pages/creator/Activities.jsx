import { useState, useEffect } from 'react';
import { ecosystemAPI } from '../../api';
import { PageLoader, Btn, StatusBadge, Input, Textarea } from '../../components/ui';
import toast from 'react-hot-toast';
import { Target, Award, Play, AlertCircle, Calendar } from 'lucide-react';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]          = useState('daily');
  const [showModal, setShowModal]    = useState(false);
  const [selectedAct, setSelectedAct]= useState(null);
  
  const [url, setUrl]                = useState('');
  const [note, setNote]              = useState('');
  const [submitting, setSubmitting]  = useState(false);

  const fetchActivities = () => {
    setLoading(true);
    ecosystemAPI.getActivities()
      .then(d => setActivities(d.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openSubmitModal = (act) => {
    setSelectedAct(act);
    setUrl('');
    setNote('');
    setShowModal(true);
  };

  const submitActivity = async (e) => {
    e.preventDefault();
    if (!note && !url) {
      toast.error('Please provide a URL or note for submission');
      return;
    }
    setSubmitting(true);
    try {
      await ecosystemAPI.submitActivity(selectedAct._id, { submissionUrl: url, submissionNote: note });
      toast.success('Activity submitted successfully for review!');
      setShowModal(false);
      fetchActivities(); // reload statuses
    } catch(e) {
      toast.error(e.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const filtered = activities.filter(a => {
    if (filter === 'challenges') return a.isChallenge;
    return a.type === filter && !a.isChallenge;
  });

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header Banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(255,107,87,0.08),rgba(108,99,255,0.04))',
        border:'1px solid rgba(255,107,87,0.15)', borderRadius:16, padding:'22px 24px',
        display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <h2 style={{ fontFamily:'var(--fd)', fontSize:18, fontWeight:800 }}>Activity Hub</h2>
            <span className="badge badge-purple">Gamified</span>
          </div>
          <p style={{ color:'var(--t2)', fontSize:13 }}>Complete daily tasks, learning quizzes, and monthly challenges to level up and earn Creator Coins!</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, borderBottom:'1px solid var(--border)' }}>
        {[
          ['daily', '📅 Daily Activities'],
          ['weekly', '🔄 Weekly Tasks'],
          ['monthly', '🏆 Monthly Championships'],
          ['challenges', '🔥 Special Challenges']
        ].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`chip${filter === k ? ' active' : ''}`}
            style={{ fontSize:12, padding:'8px 16px', borderRadius:8 }}>
            {l}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding:40, textAlign:'center', color:'var(--t3)' }}>
          <AlertCircle size={24} style={{ margin:'0 auto 10px', opacity:0.6 }} />
          No activities active in this category currently. Check back later!
        </div>
      ) : (
        <div className="grid-2" style={{ gap:16 }}>
          {filtered.map(act => (
            <div key={act._id} className="card" style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', border:act.isChallenge ? '1px solid rgba(108,99,255,0.25)' : '1px solid var(--border)' }}>
              <div>
                <div className="flex-between" style={{ marginBottom:8 }}>
                  <span className="badge badge-purple" style={{ textTransform:'uppercase', fontSize:10 }}>{act.type}</span>
                  {act.status !== 'none' && (
                    <span className={`badge badge-${act.status === 'approved' ? 'green' : act.status === 'pending' ? 'gold' : 'red'}`}>
                      {act.status === 'approved' ? 'Approved' : act.status === 'pending' ? 'Pending Review' : 'Rejected'}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize:14, fontWeight:700, marginBottom:8, color:'var(--t1)' }}>{act.title}</h3>
                <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.6, marginBottom:16 }}>{act.description}</p>
                
                {act.status !== 'none' && act.submission && (
                  <div style={{
                    marginTop: 10,
                    marginBottom: 16,
                    padding: 10,
                    borderRadius: 8,
                    background: 'var(--s2)',
                    border: '1px solid var(--border)',
                    fontSize: 11
                  }}>
                    {act.submission.rating !== undefined && act.status === 'approved' && (
                      <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⭐ {act.submission.rating}/5 Rating
                      </div>
                    )}
                    {act.submission.adminFeedback && (
                      <div style={{ color: 'var(--t2)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--t1)' }}>Feedback: </span>
                        "{act.submission.adminFeedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop:'1px solid var(--border)', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--p2)' }}>⚡ {act.xpReward} XP</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--gold)' }}>🪙 {act.coinReward} Coins</div>
                </div>
                
                {act.status === 'approved' ? (
                  <Btn variant="ghost" size="sm" disabled>✓ Completed</Btn>
                ) : act.status === 'pending' ? (
                  <Btn variant="ghost" size="sm" disabled>Under Review</Btn>
                ) : (
                  <Btn variant="primary" size="sm" onClick={() => openSubmitModal(act)}>
                    {act.status === 'rejected' ? 'Re-Submit' : 'Submit Activity'}
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {showModal && selectedAct && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:2000, padding:16, backdropFilter:'blur(4px)'
        }}>
          <div className="card" style={{ width:'100%', maxWidth:480, animation:'fadeUp 0.15s' }}>
            <div className="flex-between" style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700 }}>Submit {selectedAct.title}</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-icon">×</button>
            </div>
            
            <form onSubmit={submitActivity} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.5 }}>
                {selectedAct.description}
              </p>
              
              <Input label="Submission URL (e.g. Instagram Reel, Drive Link)"
                value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://instagram.com/reel/..." />
                
              <Textarea label="Submission Note / Answers"
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Explain your work, or answer the prompts here..."
                style={{ minHeight:90 }} />
                
              <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:8 }}>
                <Btn variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Btn>
                <Btn variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Draft'}
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
