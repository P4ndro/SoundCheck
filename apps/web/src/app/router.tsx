import { AppShell } from "@/components/layout/AppShell";
import { SettingsPage } from "@/features/band/pages/SettingsPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
import { SetlistDetailPage } from "@/features/setlists/pages/SetlistDetailPage";
import { SetlistsPage } from "@/features/setlists/pages/SetlistsPage";
import { SongDetailPage } from "@/features/songs/pages/SongDetailPage";
import { SongsPage } from "@/features/songs/pages/SongsPage";
import { ChatPage } from "@/features/chat/pages/ChatPage";
import { TabsPage } from "@/features/tabs/pages/TabsPage";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/songs" replace /> },
      { path: "songs", element: <SongsPage /> },
      { path: "songs/:id", element: <SongDetailPage /> },
      { path: "setlists", element: <SetlistsPage /> },
      { path: "setlists/:id", element: <SetlistDetailPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "tabs", element: <TabsPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
