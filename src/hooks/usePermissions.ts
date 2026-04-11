/**
 * usePermissions — single source of truth for all role/permission logic.
 *
 * Resolution order:
 *  1. isSuperAdmin → full executive access
 *  2. agency context + agencyRole 'owner' → full executive access
 *  3. agency context + agencyRole (any role string) → use that role
 *  4. personal context → use user.roles[]
 */
import { useAuth } from '../contexts/AuthContext';
import {
  checkPermission, getRoleGroup, ROLE_GROUPS, UserRole,
} from '../services/authService';

export type RoleGroup = 'creative' | 'production' | 'marketing' | 'executive';

// ─── Resolve effective roles from user object ─────────────────────────────────
const getEffectiveRoles = (user: ReturnType<typeof useAuth>['user']): UserRole[] => {
  if (!user) return [];
  if (user.isSuperAdmin) return ROLE_GROUPS.executive as UserRole[];
  if (user.activeContext === 'agency' && user.agencyRole) {
    if (user.agencyRole === 'owner') return ROLE_GROUPS.executive as UserRole[];
    return [user.agencyRole as UserRole];
  }
  return (user.roles ?? []) as UserRole[];
};

// ─── Resolve the dominant role group ─────────────────────────────────────────
// Priority: executive > marketing > production > creative
const GROUP_PRIORITY: RoleGroup[] = ['executive', 'marketing', 'production', 'creative'];

const getDominantGroup = (roles: UserRole[]): RoleGroup | null => {
  for (const group of GROUP_PRIORITY) {
    if (roles.some(r => (ROLE_GROUPS[group] as string[]).includes(r))) return group;
  }
  return null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const usePermissions = () => {
  const { user } = useAuth();
  const effectiveRoles = getEffectiveRoles(user);
  const roleGroup: RoleGroup | null = getDominantGroup(effectiveRoles);

  const can = (permission: string): boolean => checkPermission(effectiveRoles, permission);

  // ── Convenience booleans ──────────────────────────────────────────────────
  const isCreativeRole   = roleGroup === 'creative';
  const isProductionRole = roleGroup === 'production';
  const isMarketingRole  = roleGroup === 'marketing';
  const isExecutiveRole  = roleGroup === 'executive';

  // Executive = executive group OR superAdmin OR agency owner
  const isExecutive = isExecutiveRole || !!user?.isSuperAdmin ||
    (user?.activeContext === 'agency' && user?.agencyRole === 'owner');

  // Non-creative = production | marketing | executive (use executive dashboard)
  const usesExecutiveDashboard = !isCreativeRole;

  return {
    // Raw permission checks
    can,
    canUploadAsset:       can('upload_asset'),
    canViewAsset:         can('view_asset'),
    canComment:           can('comment'),
    canRequestCorrection: can('request_correction'),
    canApproveAsset:      can('approve_asset'),
    canUploadVersion:     can('upload_version'),
    canDeleteAsset:       can('delete_asset'),

    // Role group
    roleGroup,
    isCreativeRole,
    isProductionRole,
    isMarketingRole,
    isExecutiveRole,
    isExecutive,
    usesExecutiveDashboard,

    // Raw data
    effectiveRoles,
    userId: user?.id,
  };
};

// ─── Standalone helper (for non-hook contexts e.g. AccessGuard) ───────────────
export const resolveIsExecutive = (user: ReturnType<typeof useAuth>['user']): boolean => {
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  if (user.activeContext === 'agency') {
    if (!user.agencyRole) return false;
    if (user.agencyRole === 'owner') return true;
    return (ROLE_GROUPS.executive as string[]).includes(user.agencyRole);
  }
  return (user.roles ?? []).some(r => (ROLE_GROUPS.executive as string[]).includes(r));
};
