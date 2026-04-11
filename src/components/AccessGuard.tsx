/**
 * AccessGuard — wraps restricted pages/actions.
 * Uses the centralized resolveIsExecutive from usePermissions.
 *
 * Usage:
 *   <AccessGuard feature="campaigns">
 *     <CampaignUI />
 *   </AccessGuard>
 */
import { motion } from 'motion/react';
import { Lock, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { resolveIsExecutive } from '../hooks/usePermissions';

const ADMIN_EMAIL = 'admin@brainstormmediaservices.com';

export const FEATURE_LABELS = {
  'social-accounts': 'Social Accounts',
  posts:             'Posts',
  campaigns:         'Campaigns',
  startups:          'Startups',
} as const;

export type RestrictedFeature = keyof typeof FEATURE_LABELS;

interface AccessGuardProps {
  feature: RestrictedFeature;
  children: React.ReactNode;
}

/** Hook — resolves executive status via centralized logic */
export const useIsExecutive = (): boolean => {
  const { user } = useAuth();
  return resolveIsExecutive(user);
};

export const AccessGuard = ({ feature, children }: AccessGuardProps) => {
  const { user } = useAuth();
  if (resolveIsExecutive(user)) return <>{children}</>;
  return <RestrictedFallback feature={feature} />;
};

// ─── Fallback UI ──────────────────────────────────────────────────────────────
interface RestrictedFallbackProps {
  feature: RestrictedFeature;
  inline?: boolean;
}

export const RestrictedFallback = ({ feature, inline = false }: RestrictedFallbackProps) => {
  const navigate = useNavigate();
  const label = FEATURE_LABELS[feature];

  const handleEmail = () => {
    window.location.href =
      `mailto:${ADMIN_EMAIL}?subject=Access Request: ${label}` +
      `&body=Hello,%0A%0AI need access to the ${label} module in BMS Engage.%0A%0APlease grant me the necessary permissions.%0A%0AThank you.`;
  };

  const handleMessage = () => {
    navigate('/messages', {
      state: {
        prefill: `Hello, I need access to the ${label} module. Could you please grant me the necessary permissions? Thank you.`,
      },
    });
  };

  const content = (
    <>
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
        <Lock size={28} className="text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold text-text mb-2">Access Restricted</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-2 max-w-sm mx-auto">
        You don't have permission to access <span className="font-semibold text-text">{label}</span>.
      </p>
      <p className="text-sm text-text-muted leading-relaxed mb-8 max-w-sm mx-auto">
        Contact your admin or team lead to request access.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleMessage}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
        >
          <MessageSquare size={15} /> Message Admin
        </button>
        <button
          onClick={handleEmail}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm border border-border text-text hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all"
        >
          <Mail size={15} /> Send Email
        </button>
      </div>
    </>
  );

  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl bg-card border border-border"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        {content}
      </motion.div>
    </div>
  );
};

// ─── API error fallback (403 / 401) ──────────────────────────────────────────
interface ApiErrorFallbackProps {
  status?: number;
  feature?: RestrictedFeature;
  onRetry?: () => void;
}

export const ApiErrorFallback = ({ status, feature, onRetry }: ApiErrorFallbackProps) => {
  const navigate = useNavigate();
  const label = feature ? FEATURE_LABELS[feature] : 'this feature';

  if (status !== 403 && status !== 401) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
        <Lock size={24} className="text-red-400" />
      </div>
      <h3 className="font-bold text-text mb-2">
        {status === 401 ? 'Session Expired' : 'Permission Denied'}
      </h3>
      <p className="text-sm text-text-muted max-w-xs mb-6">
        {status === 401
          ? 'Your session has expired. Please log in again.'
          : `You don't have permission to access ${label}. Contact your admin.`}
      </p>
      <div className="flex gap-3">
        {status === 401 ? (
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
          >
            Log in again <ArrowRight size={14} />
          </button>
        ) : (
          <>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border border-border text-text hover:bg-white/5 transition-all"
              >
                Try again
              </button>
            )}
            <button
              onClick={() =>
                navigate('/messages', {
                  state: { prefill: `Hello, I need access to ${label}. Could you please grant me the necessary permissions?` },
                })
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              <MessageSquare size={14} /> Contact Admin
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
