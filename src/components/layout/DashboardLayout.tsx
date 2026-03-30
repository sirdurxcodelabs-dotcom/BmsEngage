import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardLayout = () => {
  const { user } = useAuth();
  // Key on user ID + activeContext so all child pages re-mount (and re-fetch) when
  // the user logs out/in as a different user OR switches personal ↔ agency context
  const layoutKey = `${user?.id ?? 'guest'}-${user?.activeContext ?? 'personal'}`;

  return (
    <div className="min-h-screen bg-background text-text flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-20 lg:ml-64 transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            key={layoutKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};
