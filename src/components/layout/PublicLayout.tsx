import { Outlet } from 'react-router-dom';
import { AppModeProvider } from '@/hooks/AppModeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout() {
  return (
    <AppModeProvider>
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-50 bg-white">
          <Header />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AppModeProvider>
  );
}
