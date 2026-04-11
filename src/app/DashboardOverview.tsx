import { lazy, Suspense } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { CampaignMarquee } from '../components/dashboard/CampaignMarquee';

const CreativeDashboard  = lazy(() => import('./dashboard/CreativeDashboard'));
const ExecutiveDashboard = lazy(() => import('./dashboard/ExecutiveDashboard'));

const Skeleton = () => (
  <div className="space-y-6 pb-16 animate-pulse">
    <div className="h-10 w-48 bg-card rounded-xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-card rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 h-64 bg-card rounded-2xl" />
      <div className="h-64 bg-card rounded-2xl" />
    </div>
  </div>
);

export default function DashboardOverview() {
  const { isCreativeRole } = usePermissions();

  return (
    <div className="space-y-0">
      <CampaignMarquee />
      <Suspense fallback={<Skeleton />}>
        {isCreativeRole ? <CreativeDashboard /> : <ExecutiveDashboard />}
      </Suspense>
    </div>
  );
}