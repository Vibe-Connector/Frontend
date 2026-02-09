import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AppLayout from '@/components/layout/AppLayout';

import Home from '@/pages/home/Home';
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
import Archive from '@/pages/archive/Archive';
import ArchiveDetail from '@/pages/archive/ArchiveDetail';

export const router = createBrowserRouter([
  // -- Public (비인증) --
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },

  // -- App (인증, Sidebar 포함) --
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Home /> },

      // Explore
      { path: '/explore', element: <Explore /> },
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

      // Archive (Sidebar: profile 모드)
      { path: '/archive', element: <Archive /> },
      { path: '/archive/:folderId', element: <ArchiveDetail /> },
    ],
  },

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
