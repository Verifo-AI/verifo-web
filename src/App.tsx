import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BrowserNodeProvider } from "@/contexts/BrowserNodeContext";

import NotFound from "@/pages/not-found";
import { Home } from "@/pages/home";
import SignInPage from "@/pages/sign-in";

import HowItWorks from "@/pages/platform/how-it-works";
import OnChainProof from "@/pages/platform/on-chain-proof";
import PrivacyModes from "@/pages/platform/privacy-modes";
import Security from "@/pages/platform/security";

import GettingStarted from "@/pages/users/getting-started";
import AiCapabilities from "@/pages/users/ai-capabilities";
import ProofExplorer from "@/pages/users/proof-explorer";
import Pricing from "@/pages/users/pricing";

import Compute from "@/pages/contributors/compute";
import Relay from "@/pages/contributors/relay";
import Verification from "@/pages/contributors/verification";
import Storage from "@/pages/contributors/storage";
import RewardsReputation from "@/pages/contributors/rewards-reputation";
import ContributorRegister from "@/pages/contributors/register";
import ContributorDashboard from "@/pages/contributors/dashboard";
import InstallDocs from "@/pages/contributors/install-docs";
import NetworkExplorer from "@/pages/explorer";
import Guide from "@/pages/guide";

import DeveloperApi from "@/pages/ecosystem/developer-api";
import Roadmap from "@/pages/ecosystem/roadmap";
import Governance from "@/pages/ecosystem/governance";
import About from "@/pages/ecosystem/about";

import Dashboard from "@/pages/dashboard/index";
import TaskHistory from "@/pages/dashboard/history";
import ProofDetail from "@/pages/dashboard/proof";
import TopUp from "@/pages/dashboard/topup";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function HomeRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  return isSignedIn ? <Redirect to="/dashboard" /> : <Home />;
}

function AuthRequired({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) {
    const returnTo = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
    return <Redirect to={`/sign-in?redirect=${encodeURIComponent(returnTo)}`} />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    // Jump to the top instantly on every route change — no smooth-scroll
    // animation. Without this, wouter (like most SPA routers) leaves the
    // scroll position wherever it was on the previous page, which looks
    // broken when a CTA/link takes you to a brand-new page that should
    // start at the top.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="auto" storageKey="theme">
        <TooltipProvider>
          <BrowserNodeProvider>
          <ScrollToTop />
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={() => <Redirect to="/sign-in" />} />

            <Route path="/dashboard" component={() => <AuthRequired><Dashboard /></AuthRequired>} />
            <Route path="/dashboard/history" component={() => <AuthRequired><TaskHistory /></AuthRequired>} />
            <Route path="/dashboard/proofs/:taskId" component={() => <AuthRequired><ProofDetail /></AuthRequired>} />
            <Route path="/dashboard/topup" component={() => <AuthRequired><TopUp /></AuthRequired>} />

            <Route path="/platform" component={() => <Redirect to="/platform/how-it-works" />} />
            <Route path="/platform/how-it-works" component={HowItWorks} />
            <Route path="/platform/on-chain-proof" component={OnChainProof} />
            <Route path="/platform/privacy-modes" component={PrivacyModes} />
            <Route path="/platform/security" component={Security} />

            <Route path="/users" component={() => <Redirect to="/users/getting-started" />} />
            <Route path="/users/getting-started" component={GettingStarted} />
            <Route path="/users/ai-capabilities" component={AiCapabilities} />
            <Route path="/users/proof-explorer" component={ProofExplorer} />
            <Route path="/users/pricing" component={Pricing} />

            <Route path="/contributors" component={() => <Redirect to="/contributors/compute" />} />
            <Route path="/contributors/compute" component={Compute} />
            <Route path="/contributors/relay" component={Relay} />
            <Route path="/contributors/verification" component={Verification} />
            <Route path="/contributors/storage" component={Storage} />
            <Route path="/contributors/rewards-reputation" component={RewardsReputation} />
            <Route path="/contributors/register" component={ContributorRegister} />
            <Route path="/contributors/dashboard" component={ContributorDashboard} />
            <Route path="/contributors/install-docs" component={InstallDocs} />
            <Route path="/contributors/guide" component={() => <Redirect to="/guide" />} />
            <Route path="/guide" component={Guide} />

            <Route path="/ecosystem" component={() => <Redirect to="/ecosystem/about" />} />
            <Route path="/ecosystem/developer-api" component={DeveloperApi} />
            <Route path="/ecosystem/roadmap" component={Roadmap} />
            <Route path="/ecosystem/governance" component={Governance} />
            <Route path="/ecosystem/about" component={About} />

            <Route path="/explorer" component={NetworkExplorer} />

            <Route component={NotFound} />
          </Switch>
          </BrowserNodeProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <SolanaWalletProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SolanaWalletProvider>
    </WouterRouter>
  );
}

export default App;
