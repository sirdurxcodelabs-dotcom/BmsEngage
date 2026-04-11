import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { cn } from '../../lib/utils';
import { Sun, Moon, LayoutDashboard, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Features', path: '/features' },
  { name: 'Contact', path: '/contact' },
];

export const MarketingNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <nav className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    active
                      ? 'text-text'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  )}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-muted hover:text-text hover:bg-white/5 rounded-lg transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {!isLoading && (
              isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                  >
                    Get started <ArrowRight size={14} />
                  </Link>
                </>
              )
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-text-muted hover:text-text rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-in panel */}
      <div className={cn(
        'fixed inset-0 z-40 lg:hidden transition-all duration-300',
        mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
        {/* Backdrop */}
        <div
          className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div className={cn(
          'absolute top-0 right-0 h-full w-72 bg-background border-l border-border shadow-2xl transition-transform duration-300 flex flex-col pt-20 px-6 pb-8',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <nav className="flex flex-col gap-1 flex-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-3 mt-6">
            {!isLoading && (
              isAuthenticated ? (
                <Link to="/dashboard" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border border-border text-text hover:bg-white/5 transition-all">
                    Log in
                  </Link>
                  <Link to="/register" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                    Get started free <ArrowRight size={14} />
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};
