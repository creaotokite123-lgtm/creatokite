import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../api';
import { Btn, Input, Textarea } from '../../components/ui';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export default function Profile() {
  const { user, refreshUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState({
    displayName: user?.displayName||'',
    email:       user?.email||'',
    companyName: user?.companyName||'',
    industry:    user?.industry||'',
    location:    user?.location||'',
    website:     user?.website||'',
    avatar:      user?.avatar||'',
    bio:         user?.bio||'',
  });

  // Sync user details on mount or change
  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName||'',
        email:       user.email||'',
        companyName: user.companyName||'',
        industry:    user.industry||'',
        location:    user.location||'',
        website:     user.website||'',
        avatar:      user.avatar||'',
        bio:         user.bio||'',
      });
    }
  }, [user]);

  const upd = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await usersAPI.updateProfile(form);
      await refreshUser();
      toast.success('Profile saved!');
    } catch(e) { 
      toast.error(e.response?.data?.message || 'Update failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("⚠️ WARNING: Deleting your account will permanently remove all your campaigns, settings, and profile data from Creatokite. This action cannot be undone.\n\nAre you sure you want to delete your account?")) {
      try {
        await usersAPI.deleteAccount();
        toast.success('Account successfully deleted.');
        localStorage.removeItem('ck_token');
        localStorage.removeItem('ck_refresh');
        setUser(null);
        navigate('/login');
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  const complete = user?.profileComplete || 0;

  return (
    <div className="page-enter" style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Header */}
      <div className="flex-between" style={{ flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontFamily:'var(--fd)', fontWeight:800, fontSize:18, marginBottom:4 }}>Brand Profile Settings</h2>
          <p style={{ color:'var(--t2)', fontSize:13 }}>Keep your company details updated so creators get to know your brand better.</p>
        </div>
        <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Btn>
      </div>

      {/* Completeness bar */}
      <div style={{ padding:'12px 16px', background:'rgba(0, 217, 255, 0.05)', border:'1px solid rgba(0, 217, 255, 0.15)', borderRadius:10 }}>
        <div className="flex-between" style={{ marginBottom:8, fontSize:12 }}>
          <span style={{ color:'var(--acc)', fontWeight:600 }}>Profile Completeness</span>
          <span style={{ fontWeight:700 }}>{complete}%</span>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width:`${complete}%`, background:'linear-gradient(90deg,var(--p),var(--acc))' }}/>
        </div>
        {complete < 85 && <div style={{ fontSize:11, color:'var(--t3)', marginTop:6 }}>Add company description, industry, location, and website logo to complete your profile.</div>}
      </div>

      {/* ── BASIC INFO ────────────────────────────────────────── */}
      <div className="card" style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <h3 style={{ fontSize:13, fontWeight:700 }}>Company Profile</h3>
        <div className="grid-2" style={{ gap:12 }}>
          <Input label="Company Name" value={form.companyName} onChange={upd('companyName')} placeholder="e.g. Acme Corp" />
          <Input label="Industry" value={form.industry} onChange={upd('industry')} placeholder="e.g. Tech, Fashion, Wellness" />
        </div>
        <div className="grid-2" style={{ gap:12 }}>
          <Input label="Contact Person Name" value={form.displayName} onChange={upd('displayName')} />
          <Input label="Email Address" value={form.email} onChange={upd('email')} type="email" />
        </div>
        <div className="grid-2" style={{ gap:12 }}>
          <Input label="Brand Logo / Avatar URL" value={form.avatar} onChange={upd('avatar')} placeholder="https://example.com/logo.jpg" hint="Paste a direct image URL" />
          <Input label="Website / Landing Page" value={form.website} onChange={upd('website')} placeholder="https://yourcompany.com" />
        </div>
        <div className="grid-2" style={{ gap:12 }}>
          <Input label="Office Location" value={form.location} onChange={upd('location')} placeholder="Mumbai, India" />
        </div>
        <Textarea label="Company Overview / Bio" value={form.bio} onChange={upd('bio')} placeholder="Tell creators about your brand mission, target audience, and style guidelines…" style={{ minHeight:100 }} />
      </div>

      {/* ── DANGER ZONE ────────────────────────────────────────── */}
      <div className="card" style={{ border:'1px solid rgba(239,68,68,0.20)', background:'rgba(239,68,68,0.02)', display:'flex', flexDirection:'column', gap:13 }}>
        <h3 style={{ fontSize:13, fontWeight:700, color:'var(--rose)', display:'flex', alignItems:'center', gap:6 }}>
          <AlertTriangle size={15} /> Danger Zone
        </h3>
        <p style={{ color:'var(--t2)', fontSize:12, lineHeight:1.5 }}>
          Once you delete your brand account, there is no going back. All campaigns, transactions, and settings will be permanently removed.
        </p>
        <div>
          <Btn variant="danger" onClick={handleDeleteAccount}>Delete Account</Btn>
        </div>
      </div>
    </div>
  );
}
