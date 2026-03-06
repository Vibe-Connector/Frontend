import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/route/ProtectedRoute';
import PublicOnlyRoute from '@/components/route/PublicOnlyRoute';

import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import Explore from '@/pages/home/Explore';
import Feed from '@/pages/feed/Feed';
import FeedDetail from '@/pages/feed/FeedDetail';
import VibeConnector from '@/pages/vibe/VibeConnector';
import VibeConnectorConnect from '@/pages/vibe/VibeConnectorConnect';
import VibeConnectorEdit from '@/pages/vibe/VibeConnectorEdit';
import VibeConnectorLoading from '@/pages/vibe/VibeConnectorLoading';
import VibeConnectorResult from '@/pages/vibe/VibeConnectorResult';
import Profile from '@/pages/mypage/Profile';
import ProfileSettings from '@/pages/mypage/ProfileSettings';
import ProfileAnalysisReport from '@/pages/mypage/ProfileAnalysisReport';
import SessionHistory from '@/pages/mypage/SessionHistory';
import Archive from '@/pages/archive/Archive';
import ArchiveDetail from '@/pages/archive/ArchiveDetail';
import OAuthCallback from '@/pages/auth/OAuthCallback';

export const router = createBrowserRouter([
  // -- Public (비인증 전용: 이미 로그인 시 / 로 리다이렉트) --
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <SignUp /> },
        ],
      },
    ],
  },

  // -- Semi-public (인증 불필요: AppLayout 사용, 비로그인도 접근 가능) --
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/explore" replace /> },
      { path: '/explore', element: <Explore /> },
    ],
  },

  // -- App (인증 필요: 미로그인 시 /login으로 리다이렉트) --
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/feed', element: <Feed /> },
          { path: '/feed/:feedId', element: <FeedDetail /> },

          // VibeConnector
          { path: '/vibe', element: <VibeConnector /> },
          { path: '/vibe/connect', element: <VibeConnectorConnect /> },
          { path: '/vibe/edit', element: <VibeConnectorEdit /> },
          { path: '/vibe/loading', element: <VibeConnectorLoading /> },
          { path: '/vibe/result/:sessionId', element: <VibeConnectorResult /> },

          // Profile (Sidebar: profile 모드)
          { path: '/profile', element: <Profile /> },
          { path: '/profile/settings', element: <ProfileSettings /> },
          { path: '/profile/report', element: <ProfileAnalysisReport /> },
          { path: '/profile/sessionhistory', element: <SessionHistory /> },

          // Archive (Sidebar: profile 모드)
          { path: '/archive', element: <Archive /> },
          { path: '/archive/:folderId', element: <ArchiveDetail /> },
        ],
      },
    ],
  },

  // -- OAuth 콜백 (인증 가드 불필요) --
  { path: '/auth/callback/:provider', element: <OAuthCallback /> },

  // 404
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-high-emphasis">404</h1>
          {/* TODO: i18n */}
          <p className="mt-2 text-caption">페이지를 찾을 수 없습니다.</p>
        </div>
      </div>
    ),
  },
]);
