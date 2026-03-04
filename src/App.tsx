import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './lib/ThemeContext';
import LandingPage from './app/LandingPage';
import AboutPage from './app/marketing/AboutPage';
import ServicesPage from './app/marketing/ServicesPage';
import FeaturesPage from './app/marketing/FeaturesPage';
import PricingPage from './app/marketing/PricingPage';
import CaseStudiesPage from './app/marketing/CaseStudiesPage';
import ContactPage from './app/marketing/ContactPage';
import SignInPage from './app/auth/SignInPage';
import SignUpPage from './app/auth/SignUpPage';
import ForgotPasswordPage from './app/auth/ForgotPasswordPage';
import VerifyEmailPage from './app/auth/VerifyEmailPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import DashboardOverview from './app/DashboardOverview';
import GalleryPage from './app/GalleryPage';
import SocialAccountsPage from './app/SocialAccountsPage';
import ComposerPage from './app/ComposerPage';
import SchedulerPage from './app/SchedulerPage';
import AnalyticsPage from './app/AnalyticsPage';
import SettingsPage from './app/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/social-accounts" element={<SocialAccountsPage />} />
            <Route path="/composer" element={<ComposerPage />} />
            <Route path="/scheduler" element={<SchedulerPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
    </ThemeProvider>
  );
}
