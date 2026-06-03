import { useState, useEffect } from 'react';
import { ecosystemAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader, Btn, Avatar, Input, Textarea } from '../../components/ui';
import toast from 'react-hot-toast';
import { MessageSquare, ThumbsUp, Send, Share2, Plus, Sparkles, Megaphone } from 'lucide-react';

const CATEGORIES = ['General', 'Knowledge Sharing', 'Q&A', 'Feedback'];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  // Create post states
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postCat, setPostCat] = useState('General');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);

  // Comments state
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPosts = () => {
    ecosystemAPI.getPosts({
      category: category === 'all' ? undefined : category,
      search: search || undefined
    })
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }
    setCreating(true);
    
    // Filter out blank poll options
    const activePolls = pollOptions.filter(o => o.trim() !== '');

    try {
      await ecosystemAPI.createPost({
        title,
        content,
        category: postCat,
        pollOptions: activePolls.length > 0 ? activePolls : undefined
      });
      toast.success('Post created! +10 XP awarded.');
      setShowCreate(false);
      setTitle('');
      setContent('');
      setPollOptions(['', '']);
      fetchPosts();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await ecosystemAPI.likePost(id);
      setPosts(prev => prev.map(p => p._id === id ? { ...p, likes: res.likes } : p));
    } catch(e) {}
  };

  const handleVote = async (postId, optionIndex) => {
    try {
      const res = await ecosystemAPI.votePoll(postId, { optionIndex });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, pollOptions: res.pollOptions } : p));
      toast.success('Vote counted!');
    } catch(e) {}
  };

  const openComments = async (postId) => {
    setActivePostId(postId);
    setCommentText('');
    try {
      const res = await ecosystemAPI.getComments(postId);
      setComments(res.comments || []);
    } catch(e) {}
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await ecosystemAPI.addComment(activePostId, { text: commentText });
      setComments(prev => [...prev, res.comment]);
      setCommentText('');
      setPosts(prev => prev.map(p => p._id === activePostId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
      toast.success('Comment added!');
    } catch(err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading && posts.length === 0) return <PageLoader />;

  return (
    <div className="page-enter" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
      
      {/* Social Feed (Left Column) */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* Search and Action Bar */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <input className="form-input" style={{ flex:1, minWidth:200 }}
            placeholder="🔍 Search posts or discussions..."
            value={search} onChange={e => setSearch(e.target.value)} />
          <Btn variant="primary" style={{ display:'flex', alignItems:'center', gap:6 }} onClick={() => setShowCreate(true)}>
            <Plus size={14}/> Create Post
          </Btn>
        </div>

        {/* Create Post Card Toggle */}
        {showCreate && (
          <div className="card" style={{ border:'1px solid var(--p2)' }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>New Discussion</h3>
            <form onSubmit={handleCreatePost} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="grid-2" style={{ gap:12 }}>
                <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What is on your mind?" />
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={postCat} onChange={e => setPostCat(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <Textarea label="Discussion Content" value={content} onChange={e => setContent(e.target.value)} placeholder="Share your experience, ask questions, or link guides..." style={{ minHeight:100 }} />
              
              {/* Optional Poll Fields */}
              <div style={{ background:'var(--s2)', padding:12, borderRadius:8, border:'1px solid var(--border)' }}>
                <h4 style={{ fontSize:11, fontWeight:700, color:'var(--t3)', marginBottom:8 }}>📊 Create a Poll (Optional)</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {pollOptions.map((opt, oIdx) => (
                    <input key={oIdx} className="form-input" style={{ height:32, fontSize:12 }}
                      placeholder={`Option ${oIdx+1}`} value={opt}
                      onChange={e => {
                        const copy = [...pollOptions];
                        copy[oIdx] = e.target.value;
                        setPollOptions(copy);
                      }} />
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize:11, alignSelf:'flex-start' }}
                    onClick={() => setPollOptions(prev => [...prev, ''])}>
                    + Add Option
                  </button>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                <Btn variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Btn>
                <Btn variant="primary" type="submit" disabled={creating}>
                  {creating ? 'Posting...' : 'Publish Post'}
                </Btn>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="card" style={{ padding:40, textAlign:'center', color:'var(--t3)' }}>
            No discussions found. Start a new conversation!
          </div>
        ) : (
          posts.map(post => {
            const hasLiked = post.likes?.includes(user?._id);
            const totalVotes = post.pollOptions?.reduce((s, o) => s + (o.votes?.length || 0), 0) || 0;

            return (
              <div key={post._id} className="card" style={{ border: post.isAnnouncement ? '1px solid rgba(255,107,87,0.25)' : '1px solid var(--border)' }}>
                {/* Author Info */}
                <div className="flex-between" style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar src={post.creator?.avatar} name={post.creator?.displayName} size={36} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                        {post.creator?.displayName}
                        {post.creator?.role === 'superadmin' && <span className="badge badge-red" style={{ fontSize:8 }}>SA</span>}
                        {post.creator?.role === 'admin' && <span className="badge badge-gold" style={{ fontSize:8 }}>Admin</span>}
                      </div>
                      <div style={{ fontSize:11, color:'var(--t3)' }}>
                        @{post.creator?.handle || 'announcement'} · {post.creator?.rank || 'Bronze'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {post.isAnnouncement && (
                      <span className="badge badge-gold" style={{ display:'flex', alignItems:'center', gap:3, fontSize:10 }}>
                        <Megaphone size={10} /> ANNOUNCEMENT
                      </span>
                    )}
                    <span className="badge badge-purple" style={{ fontSize:10 }}>{post.category}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 style={{ fontSize:14, fontWeight:800, marginBottom:8, color:'var(--t1)' }}>{post.title}</h3>
                <p style={{ fontSize:12, color:'var(--t2)', lineHeight:1.6, whiteSpace:'pre-line', marginBottom:16 }}>
                  {post.content}
                </p>

                {/* Optional Poll Rendering */}
                {post.pollOptions && post.pollOptions.length > 0 && (
                  <div style={{ background:'var(--s2)', border:'1px solid var(--border)', padding:12, borderRadius:8, marginBottom:16, display:'flex', flexDirection:'column', gap:8 }}>
                    {post.pollOptions.map((opt, oIdx) => {
                      const voteCount = opt.votes?.length || 0;
                      const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      const hasVoted = opt.votes?.includes(user?._id);

                      return (
                        <div key={oIdx} onClick={() => handleVote(post._id, oIdx)}
                          style={{
                            position:'relative', display:'flex', justifyContent:'space-between',
                            padding:'10px 12px', border:'1px solid var(--border)', borderRadius:6,
                            cursor:'pointer', background:'var(--bg)', overflow:'hidden'
                          }}>
                          {/* Progress bar fill background */}
                          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${pct}%`, background:'rgba(108,99,255,0.06)', transition:'width 0.3s' }}/>
                          <span style={{ fontSize:12, fontWeight: hasVoted ? 700 : 400, zIndex:1, display:'flex', alignItems:'center', gap:6 }}>
                            {hasVoted && '✓ '} {opt.text}
                          </span>
                          <span style={{ fontSize:11, color:'var(--t3)', zIndex:1 }}>
                            {voteCount} vote{voteCount !== 1 ? 's' : ''} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display:'flex', gap:16, borderTop:'1px solid var(--border)', paddingTop:12, fontSize:12, color:'var(--t3)' }}>
                  <button onClick={() => handleLike(post._id)}
                    style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5, color: hasLiked ? 'var(--p2)' : 'var(--t3)' }}>
                    <ThumbsUp size={14} /> {post.likes?.length || 0} Like
                  </button>
                  <button onClick={() => openComments(post._id)}
                    style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:5, color:'var(--t3)' }}>
                    <MessageSquare size={14} /> {post.commentsCount || 0} Comments
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Side Filters & Comments Drawer (Right Column) */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* Category Filter Card */}
        <div className="card">
          <h3 style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Category Filters</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <button onClick={() => setCategory('all')} className={`chip${category === 'all' ? ' active' : ''}`} style={{ justifyContent:'flex-start', padding:'8px 12px', fontSize:12 }}>🌎 All Discussions</button>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`chip${category === c ? ' active' : ''}`} style={{ justifyContent:'flex-start', padding:'8px 12px', fontSize:12 }}># {c}</button>
            ))}
          </div>
        </div>

        {/* Comments Side Drawer */}
        {activePostId && (
          <div className="card" style={{ animation:'fadeUp 0.15s' }}>
            <div className="flex-between" style={{ marginBottom:14 }}>
              <h3 style={{ fontSize:13, fontWeight:700 }}>Comments ({comments.length})</h3>
              <button onClick={() => setActivePostId(null)} className="btn btn-ghost btn-sm">Close</button>
            </div>
            
            {/* List */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:260, overflowY:'auto', marginBottom:14, paddingRight:4 }}>
              {comments.length === 0 ? (
                <p style={{ color:'var(--t3)', fontSize:12, textAlign:'center', padding:10 }}>Be the first to leave a comment!</p>
              ) : (
                comments.map(c => (
                  <div key={c._id} style={{ display:'flex', gap:8, background:'var(--s2)', padding:10, borderRadius:8, border:'1px solid var(--border)' }}>
                    <Avatar src={c.sender?.avatar} name={c.sender?.displayName} size={26} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:11, fontWeight:700 }}>{c.sender?.displayName}</div>
                      <p style={{ fontSize:11, color:'var(--t2)', marginTop:3, wordBreak:'break-word' }}>{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddComment} style={{ display:'flex', gap:6 }}>
              <input className="form-input" style={{ flex:1, height:34, fontSize:12 }}
                value={commentText} onChange={e => setCommentText(e.target.value)}
                placeholder="Add a reply..." />
              <button type="submit" disabled={submittingComment} className="btn btn-primary btn-icon" style={{ height:34, width:34 }}>
                <Send size={12} />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
