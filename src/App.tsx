import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/router';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { useAuthStore } from '@/store/authStore';
import i18n from '@/i18n/config';
import { LANGUAGE_MAP } from '@/i18n/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function LanguageSync() {
  const preferredLanguageId = useAuthStore((s) => s.user?.preferredLanguageId);

  useEffect(() => {
    const lang = preferredLanguageId ? LANGUAGE_MAP[preferredLanguageId] : null;
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [preferredLanguageId]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <LanguageSync />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
