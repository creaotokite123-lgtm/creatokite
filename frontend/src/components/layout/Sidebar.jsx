/*sidebar*/
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui';
import {
  LayoutDashboard, Megaphone, Users, BarChart2,
  Trophy, PlusCircle, LogOut, TrendingUp, Wallet,
  Target, UserCheck, Settings, X, Play, Activity,
} from 'lucide-react';

/* Creator — no Reel Tracker, no Creator Analysis */
const CREATOR_NAV = [
  { to: '/creator/dashboard',   icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/creator/assigned',    icon: Target,          label: 'My Campaigns' },
  { to: '/creator/activities',  icon: Play,            label: 'Activities'   },
  { to: '/creator/academy',     icon: Trophy,          label: 'Academy'      },
  { to: '/creator/community',   icon: Users,           label: 'Community'    },
  { to: '/creator/analytics',   icon: BarChart2,       label: 'Analytics'    },
  { to: '/creator/earnings',    icon: Wallet,          label: 'Earnings'     },
  { to: '/creator/leaderboard', icon: TrendingUp,      label: 'Leaderboard'  },
  { to: '/creator/profile',     icon: Settings,        label: 'Profile'      },
];

/* Brand — no Creator Analysis, no Reel Tracker */
const BRAND_NAV = [
  { to: '/brand/dashboard',        icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/brand/campaigns/create', icon: PlusCircle,      label: 'New Campaign' },
  { to: '/brand/campaigns',        icon: Megaphone,       label: 'My Campaigns' },
  { to: '/brand/analytics',        icon: BarChart2,       label: 'Analytics'    },
  { to: '/brand/profile',          icon: Settings,        label: 'Profile'      },
];

/* Admin — no Creator Analysis; Reel Analytics stays */
const ADMIN_NAV = [
  { to: '/admin/dashboard',        icon: LayoutDashboard, label: 'Dashboard'         },
  { to: '/admin/activities',       icon: Activity,        label: 'Activity Hub'      },
  { to: '/admin/campaigns',        icon: Megaphone,       label: 'Campaigns'         },
  { to: '/admin/users',            icon: Users,           label: 'Users'             },
  { to: '/admin/analytics',        icon: TrendingUp,      label: 'Analytics'         },
  { to: '/admin/creator-approval', icon: UserCheck,       label: 'Creator Approvals' },
  { to: '/admin/reels',            icon: Play,            label: 'Reel Analytics',   badge: 'NEW' },
];

/* SuperAdmin — inherits Admin + Override Controls */
const SUPERADMIN_NAV = [
  { to: '/superadmin/dashboard',   icon: LayoutDashboard, label: 'Control Center'    },
  { to: '/admin/activities',       icon: Activity,        label: 'Activity Hub'      },
  { to: '/admin/campaigns',        icon: Megaphone,       label: 'Campaigns'         },
  { to: '/admin/users',            icon: Users,           label: 'Users'             },
  { to: '/admin/analytics',        icon: TrendingUp,      label: 'Analytics'         },
  { to: '/admin/creator-approval', icon: UserCheck,       label: 'Creator Approvals' },
  { to: '/admin/reels',            icon: Play,            label: 'Reel Analytics'    },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const nav = user?.role === 'creator' ? CREATOR_NAV
            : user?.role === 'brand'   ? BRAND_NAV
            : user?.role === 'superadmin' ? SUPERADMIN_NAV
            : ADMIN_NAV;

  const roleColor = user?.role === 'superadmin' ? 'var(--rose)'
                  : user?.role === 'admin'   ? 'var(--gold)'
                  : user?.role === 'brand'   ? 'var(--acc)'
                  : 'var(--p2)';

  const roleLabel = user?.role === 'superadmin' ? 'Control Center (SA)'
                  : user?.role === 'admin'   ? 'Control Center'
                  : user?.role === 'brand'   ? 'Brand Portal'
                  : 'Creator Studio';

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Dark overlay behind sidebar on mobile */}
      <div
        className={`sidebar-overlay${isOpen ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <nav
        className={`sidebar${isOpen ? ' open' : ''}`}
        aria-label="Sidebar navigation"
        role="navigation"
      >
        {/* ── Logo ──────────────────────────────────────── */}
        <div className="sidebar-logo" style={{
          padding: '16px 14px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <img 
  src="/src/assets/logo.jpeg" 
  alt="CreatoKite" 
  style={{ width:30, height:30, borderRadius:8, objectFit:'contain', flexShrink:0 }} 
                   />
            <div className="sidebar-logo-text">
              <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 15, color: 'var(--t1)', lineHeight: 1 }}>
                Creatokite
              </div>
              <div className="sidebar-role-badge" style={{
                fontSize: 9, color: roleColor, marginTop: 2,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>
                {roleLabel}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon show-mobile"
            aria-label="Close sidebar"
            style={{ marginLeft: 'auto' }}
          >
            <X size={18} />
          </button>
        </div>

        
        {/* ── Navigation ────────────────────────────────── */}
          <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          {nav.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="nav-item-label">{label}</span>
              {badge && (
                <span style={{
                  marginLeft: 'auto', fontSize: 9, fontWeight: 800, letterSpacing: 0.8,
                  padding: '2px 6px', borderRadius: 99,
                  background: 'linear-gradient(135deg,var(--p),var(--acc))',
                  color: '#fff',
                }}>{badge}</span>
              )}
            </NavLink>
          ))}
        </div>

        
        {/* ── User Card ─────────────────────────────────── */}
        <div style={{ padding: '8px 10px calc(18px + var(--safe-bottom))', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div className="sidebar-user" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
            borderRadius: 'var(--r)', background: 'rgba(255,255,255,0.03)', marginBottom: 4,
          }}>
            <Avatar src={user?.avatar} name={user?.displayName} size={26} />
            <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--t1)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.displayName}
              </div>
              <div style={{
                fontSize: 9, color: 'var(--t3)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm w-full"
            style={{ justifyContent: 'flex-start', color: 'var(--rose)', padding: '4px 8px', height: '28px', fontSize: '11px' }}
          >
            <LogOut size={12} aria-hidden="true" />
            <span className="nav-item-label" style={{ fontSize: '11px' }}>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}
