import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { appRoutes } from "./routes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/features/auth/auth-context";

const HomePage = lazy(() => import("@/pages/Index"));
const AboutPage = lazy(() => import("@/pages/About"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const PrivacyPage = lazy(() => import("@/pages/Privacy"));
const TermsPage = lazy(() => import("@/pages/Terms"));
const LoginPage = lazy(() => import("@/pages/Login"));
const SignupPage = lazy(() => import("@/pages/Signup"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const WorkspacePage = lazy(() => import("@/pages/Workspace"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPassword"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

const RouteFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Loading...</div>
);

const MarketingLayout = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Outlet />
    <Footer />
  </div>
);

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { authEnabled, isLoading, user } = useAuth();

  if (isLoading) {
    return <RouteFallback />;
  }

  if (!authEnabled) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return <>{children}</>;
};

export const AppRouter = () => (
  <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <ScrollToHash />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path={appRoutes.home} element={<HomePage />} />
          <Route path="/features" element={<Navigate to="/#features" replace />} />
          <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
          <Route path={appRoutes.about} element={<AboutPage />} />
          <Route path={appRoutes.contact} element={<ContactPage />} />
          <Route path={appRoutes.privacy} element={<PrivacyPage />} />
          <Route path={appRoutes.terms} element={<TermsPage />} />
          <Route
            path={appRoutes.dashboard}
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path={appRoutes.workspace}
            element={
              <RequireAuth>
                <WorkspacePage />
              </RequireAuth>
            }
          />
          <Route
            path={appRoutes.profile}
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Route>
        <Route path={appRoutes.login} element={<LoginPage />} />
        <Route path={appRoutes.signup} element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
