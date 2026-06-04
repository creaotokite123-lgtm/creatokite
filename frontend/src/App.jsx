import LoginSuccess from './pages/LoginSuccess';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute, GuestRoute } from './router/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import { PageLoader } from './components/ui';

/* Pages */
import Landing       from './pages/Landing';
import Login         from './pages/auth/Login';
import Register      from './pages/auth/Register';

import CreatorDashboard  from './pages/creator/Dashboard';
import AssignedCampaigns from './pages/creator/AssignedCampaigns';
import CreatorAnalytics  from './pages/creator/Analytics';
import CreatorEarnings   from './pages/creator/Earnings';
import Leaderboard       from './pages/creator/Leaderboard';
import CreatorProfile    from './pages/creator/Profile';

import BrandDashboard from './pages/brand/BrandDashboard';
import CreateCampaign from './pages/brand/CreateCampaign';
import BrandCampaigns from './pages/brand/BrandCampaigns';
import BrandAnalytics from './pages/brand/BrandAnalytics';
import CampaignDetail from './pages/brand/CampaignDetail';
import BrandProfile    from './pages/brand/Profile';

import Activities        from './pages/creator/Activities';
import Academy           from './pages/creator/Academy';
import Community         from './pages/creator/Community';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

import AdminDashboard       from './pages/admin/AdminDashboard';
import AdminCampaigns       from './pages/admin/AdminCampaigns';
import AdminUsers           from './pages/admin/AdminUsers';
import AdminAnalytics       from './pages/admin/AdminAnalytics';
import AdminCreatorApproval from './pages/admin/AdminCreatorApproval';
import AdminReelAnalytics   from './pages/admin/AdminReelAnalytics';


export default function App() {
  return (
    <Routes>
      {/* Public — Landing always shows at /, logged-in users can still visit it */}
      <Route path="/"              element={<Landing />} />
      <Route path="/login"         element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register"      element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* Creator — no ReelTracker, no CreatorAnalysis */}
      <Route element={<ProtectedRoute roles={['creator']}><AppLayout /></ProtectedRoute>}>
        <Route path="/creator/dashboard"   element={<CreatorDashboard />} />
        <Route path="/creator/assigned"    element={<AssignedCampaigns />} />
        <Route path="/creator/analytics"   element={<CreatorAnalytics />} />
        <Route path="/creator/earnings"    element={<CreatorEarnings />} />
        <Route path="/creator/leaderboard" element={<Leaderboard />} />
        <Route path="/creator/profile"     element={<CreatorProfile />} />
        <Route path="/creator/activities"  element={<Activities />} />
        <Route path="/creator/academy"     element={<Academy />} />
        <Route path="/creator/community"   element={<Community />} />
      </Route>

      {/* Brand — no CreatorAnalysis, no ReelTracker */}
      <Route element={<ProtectedRoute roles={['brand']}><AppLayout /></ProtectedRoute>}>
        <Route path="/brand/dashboard"        element={<BrandDashboard />} />
        <Route path="/brand/campaigns/create" element={<CreateCampaign />} />
        <Route path="/brand/campaigns"        element={<BrandCampaigns />} />
        <Route path="/brand/campaigns/:id"    element={<CampaignDetail />} />
        <Route path="/brand/analytics"        element={<BrandAnalytics />} />
        <Route path="/brand/profile"          element={<BrandProfile />} />
      </Route>

      {/* Admin — no CreatorAnalysis; Reel Analytics stays */}
      <Route element={<ProtectedRoute roles={['admin']}><AppLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard"        element={<AdminDashboard />} />
        <Route path="/admin/campaigns"        element={<AdminCampaigns />} />
        <Route path="/admin/users"            element={<AdminUsers />} />
        <Route path="/admin/analytics"        element={<AdminAnalytics />} />
        <Route path="/admin/creator-approval" element={<AdminCreatorApproval />} />
        <Route path="/admin/reels"            element={<AdminReelAnalytics />} />
        <Route path="/admin/activities"       element={<SuperAdminDashboard />} />
      </Route>

      {/* SuperAdmin — Inherits everything + Dashboard overrides */}
      <Route element={<ProtectedRoute roles={['superadmin']}><AppLayout /></ProtectedRoute>}>
        <Route path="/superadmin/dashboard"   element={<SuperAdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
