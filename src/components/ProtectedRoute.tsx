import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Superadmin always goes to /admin — block them from regular dashboard
  if (user?.isSuperAdmin && !adminOnly) return <Navigate to="/admin" replace />;

  // Admin-only routes: non-superadmin gets redirected
  if (adminOnly && !user?.isSuperAdmin) return <Navigate to="/dashboard" replace />;

  // Blocked accounts
  if (!user?.isSuperAdmin && (user?.accountStatus === 'rejected' || user?.accountStatus === 'suspended')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center glass p-10 rounded-2xl border border-white/10">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-black text-text mb-2">Account {user.accountStatus === 'rejected' ? 'Rejected' : 'Suspended'}</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            {user.accountStatus === 'rejected'
              ? 'Your account has been rejected. Please contact support for more information.'
              : 'Your account has been suspended. Please contact support to resolve this.'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
