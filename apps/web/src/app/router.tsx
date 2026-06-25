import { GuestGuard } from "@/features/auth/components/GuestGuard";
import { ProtectedAppShell } from "@/features/auth/components/ProtectedAppShell";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { LandingPage } from "@/features/auth/pages/LandingPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";
import {
  BandOnboardingGuard,
  OnboardingRedirectPage,
  ProfileOnboardingGuard,
} from "@/features/onboarding/components/OnboardingGuards";
import { BandOnboardingPage } from "@/features/onboarding/pages/BandOnboardingPage";
import { ProfileOnboardingPage } from "@/features/onboarding/pages/ProfileOnboardingPage";
import { SettingsPage } from "@/features/band/pages/SettingsPage";
import { MemberProfilePage } from "@/features/band/pages/MemberProfilePage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
import { SetlistDetailPage } from "@/features/setlists/pages/SetlistDetailPage";
import { SetlistsPage } from "@/features/setlists/pages/SetlistsPage";
import { SongDetailPage } from "@/features/songs/pages/SongDetailPage";
import { SongsPage } from "@/features/songs/pages/SongsPage";
import { ChatPage } from "@/features/chat/pages/ChatPage";
import { TabsPage } from "@/features/tabs/pages/TabsPage";
import { createBrowserRouter, Outlet } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "login/*",
        element: (
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        ),
      },
      {
        path: "signup/*",
        element: (
          <GuestGuard>
            <SignUpPage />
          </GuestGuard>
        ),
      },
      {
        path: "onboarding",
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <OnboardingRedirectPage /> },
          {
            path: "profile",
            element: (
              <ProfileOnboardingGuard>
                <ProfileOnboardingPage />
              </ProfileOnboardingGuard>
            ),
          },
          {
            path: "band",
            element: (
              <BandOnboardingGuard>
                <BandOnboardingPage />
              </BandOnboardingGuard>
            ),
          },
        ],
      },
      {
        element: <ProtectedAppShell />,
        children: [
          { path: "songs", element: <SongsPage /> },
          { path: "songs/:id", element: <SongDetailPage /> },
          { path: "setlists", element: <SetlistsPage /> },
          { path: "setlists/:id", element: <SetlistDetailPage /> },
          { path: "calendar", element: <CalendarPage /> },
          { path: "tabs", element: <TabsPage /> },
          { path: "chat", element: <ChatPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "settings/members/:userId", element: <MemberProfilePage /> },
        ],
      },
    ],
  },
]);
