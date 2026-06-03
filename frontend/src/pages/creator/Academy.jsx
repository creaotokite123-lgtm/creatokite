import { useState, useEffect } from 'react';
import { ecosystemAPI } from '../../api';
import { PageLoader, Btn, Input, Textarea } from '../../components/ui';
import toast from 'react-hot-toast';
import { Award, BookOpen, CheckCircle, GraduationCap, Play, HelpCircle } from 'lucide-react';

const CATEGORIES = [
  'Instagram Growth',
  'Content Creation',
  'Reel Editing',
  'Video Editing',
  'Brand Collaboration',
  'Negotiation',
  'Personal Branding',
  'Marketing',
  'Communication',
  'AI Tools'
];

export default function Academy() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [activeLesson, setActiveLesson] = useState(null);
  
  // Quiz / Assignment states
  const [quizAnswers, setQuizAnswers] = useState({});
  const [assignmentText, setAssignmentText] = useState('');
  const [completing, setCompleting] = useState(false);

  const fetchLessons = () => {
    setLoading(true);
    ecosystemAPI.getLessons()
      .then(d => {
        setLessons(d.lessons || []);
        // Set first lesson if not set
        const catLessons = (d.lessons || []).filter(l => l.category === selectedCat);
        if (catLessons.length > 0 && !activeLesson) {
          setActiveLesson(catLessons[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLessons();
  }, [selectedCat]);

  const selectCategory = (cat) => {
    setSelectedCat(cat);
    setActiveLesson(null);
    setQuizAnswers({});
    setAssignmentText('');
  };

  const selectLesson = (les) => {
    setActiveLesson(les);
    setQuizAnswers({});
    setAssignmentText('');
  };

  const handleQuizAnswer = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitCompletion = async (e) => {
    e.preventDefault();
    if (!activeLesson) return;
    
    let answersArray = [];
    if (activeLesson.type === 'quiz' && activeLesson.quizQuestions?.length) {
      // Validate all answered
      const unanswered = activeLesson.quizQuestions.some((_, i) => quizAnswers[i] === undefined);
      if (unanswered) {
        toast.error('Please answer all questions before submitting.');
        return;
      }
      // Form array
      answersArray = activeLesson.quizQuestions.map((_, i) => quizAnswers[i]);
    }

    if (activeLesson.type === 'assignment' && !assignmentText) {
      toast.error('Please submit your assignment response text.');
      return;
    }

    setCompleting(true);
    try {
      const res = await ecosystemAPI.completeLesson(activeLesson._id, {
        quizAnswers: answersArray,
        assignmentText
      });
      toast.success(res.message || 'Lesson completed!');
      if (res.newCertificate) {
        toast.success(`🎓 Certification Earned: ${res.newCertificate.name}! Check your profile.`, { duration: 6000 });
      }
      fetchLessons();
      // Auto advance or reload
      setActiveLesson(prev => ({ ...prev, isCompleted: true }));
    } catch(err) {
      toast.error(err.response?.data?.message || 'Completion failed. Check answers and try again.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading && lessons.length === 0) return <PageLoader />;

  const catLessons = lessons.filter(l => l.category === selectedCat);
  const completedCount = catLessons.filter(l => l.isCompleted).length;
  const progressPercent = catLessons.length > 0 ? Math.round((completedCount / catLessons.length) * 100) : 0;

  return (
    <div className="page-enter" style={{ display:'grid', gridTemplateColumns:'250px 1fr', gap:20 }}>
      
      {/* Sidebar Categories */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <h3 style={{ fontSize:13, fontWeight:700, padding:'0 8px 8px', borderBottom:'1px solid var(--border)', color:'var(--t3)' }}>
          Learning Paths
        </h3>
        <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:'70vh', overflowY:'auto' }}>
          {CATEGORIES.map(cat => {
            const isSel = selectedCat === cat;
            const totalInCat = lessons.filter(l => l.category === cat);
            const compInCat = totalInCat.filter(l => l.isCompleted).length;
            const isFinished = totalInCat.length > 0 && totalInCat.length === compInCat;

            return (
              <button key={cat} onClick={() => selectCategory(cat)}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'start', gap:4,
                  padding:'10px 12px', borderRadius:8, border:'none', cursor:'pointer',
                  background: isSel ? 'rgba(255,107,87,0.1)' : 'transparent',
                  color: isSel ? 'var(--p2)' : 'var(--t2)',
                  textAlign:'left', transition:'background 0.2s'
                }}>
                <div style={{ fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                  {isFinished ? <GraduationCap size={14} color="var(--acc2)"/> : <BookOpen size={13}/>}
                  {cat}
                </div>
                <div style={{ fontSize:10, color:'var(--t3)' }}>
                  {compInCat}/{totalInCat.length} completed
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Study Arena */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* Course Banner */}
        <div className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(135deg,rgba(108,99,255,0.06),rgba(0,217,255,0.03))' }}>
          <div>
            <h2 style={{ fontFamily:'var(--fd)', fontSize:16, fontWeight:800, marginBottom:4 }}>{selectedCat} Path</h2>
            <p style={{ fontSize:12, color:'var(--t2)' }}>Complete all modules in this path to unlock your official path certificate!</p>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--acc2)' }}>{progressPercent}% Complete</div>
            <div className="progress" style={{ width:120, height:6, marginTop:6 }}>
              <div className="progress-bar" style={{ width:`${progressPercent}%`, background:'var(--acc2)' }}/>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:16, alignItems:'start' }}>
          {/* Lessons List in Category */}
          <div className="card" style={{ padding:10, display:'flex', flexDirection:'column', gap:6 }}>
            <h4 style={{ fontSize:11, fontWeight:700, color:'var(--t3)', padding:6 }}>Modules</h4>
            {catLessons.map((les, idx) => {
              const isActive = activeLesson?._id === les._id;
              return (
                <div key={les._id} onClick={() => selectLesson(les)}
                  style={{
                    display:'flex', alignItems:'center', gap:8, padding:'8px 10px',
                    borderRadius:6, cursor:'pointer',
                    background: isActive ? 'var(--s2)' : 'transparent',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  }}>
                  {les.isCompleted ? (
                    <CheckCircle size={14} color="var(--acc2)" style={{ flexShrink:0 }} />
                  ) : (
                    <HelpCircle size={14} color="var(--t3)" style={{ flexShrink:0 }} />
                  )}
                  <span style={{ fontSize:12, color:isActive ? 'var(--t1)' : 'var(--t2)', fontWeight: isActive?700:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {idx+1}. {les.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Lesson Reader */}
          {activeLesson ? (
            <div className="card" style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <div className="flex-between" style={{ marginBottom:6 }}>
                  <span className="badge badge-purple" style={{ textTransform:'uppercase', fontSize:10 }}>{activeLesson.type}</span>
                  <div style={{ fontSize:11, color:'var(--t3)' }}>Reward: +{activeLesson.xpReward} XP / +{activeLesson.coinReward} Coins</div>
                </div>
                <h3 style={{ fontSize:15, fontWeight:800, color:'var(--t1)' }}>{activeLesson.title}</h3>
              </div>

              {/* Content */}
              <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7, background:'var(--s2)', padding:14, borderRadius:8, border:'1px solid var(--border)' }}>
                {activeLesson.content}
              </div>

              {/* Task Quiz / Assignment submission */}
              {activeLesson.isCompleted ? (
                <div style={{ display:'flex', alignItems:'center', gap:8, color:'var(--acc2)', fontSize:13, fontWeight:700, padding:'10px 14px', borderRadius:8, background:'rgba(52,211,153,0.06)' }}>
                  <CheckCircle size={16}/> Completed! XP & Coins awarded.
                </div>
              ) : (
                <form onSubmit={submitCompletion} style={{ borderTop:'1px solid var(--border)', paddingTop:16, display:'flex', flexDirection:'column', gap:14 }}>
                  {activeLesson.type === 'quiz' && activeLesson.quizQuestions?.length > 0 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      {activeLesson.quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <div style={{ fontSize:13, fontWeight:600 }}>Q{qIdx+1}. {q.question}</div>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:6 }}>
                            {q.options.map((opt, optIdx) => {
                              const isChecked = quizAnswers[qIdx] === optIdx;
                              return (
                                <label key={optIdx}
                                  style={{
                                    display:'flex', alignItems:'center', gap:8, padding:'10px 12px',
                                    borderRadius:6, border:'1px solid var(--border)', cursor:'pointer',
                                    background: isChecked ? 'rgba(108,99,255,0.05)' : 'var(--s1)',
                                    borderColor: isChecked ? 'var(--p2)' : 'var(--border)'
                                  }}>
                                  <input type="radio" name={`q_${qIdx}`} checked={isChecked}
                                    onChange={() => handleQuizAnswer(qIdx, optIdx)}
                                    style={{ display:'none' }} />
                                  <span style={{ fontSize:12 }}>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeLesson.type === 'article' && activeLesson.assignmentPrompt && (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <label className="form-label" style={{ fontWeight:700 }}>📝 Practical Assignment Prompt</label>
                      <p style={{ fontSize:12, color:'var(--t2)', marginBottom:6 }}>{activeLesson.assignmentPrompt}</p>
                      <Textarea value={assignmentText} onChange={e => setAssignmentText(e.target.value)}
                        placeholder="Write your assignment essay response here (min 50 words)..."
                        style={{ minHeight:120 }} />
                    </div>
                  )}

                  <Btn variant="primary" type="submit" disabled={completing} style={{ alignSelf:'flex-end' }}>
                    {completing ? 'Completing Path...' : 'Submit Answers'}
                  </Btn>
                </form>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding:40, textAlign:'center', color:'var(--t3)' }}>
              Select a module from the list to start studying!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
