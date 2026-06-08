import {
  Calendar,
  Guitar,
  ListMusic,
  MessageCircle,
  Music2,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { label: "Songs", href: "/songs", icon: Music2 },
  { label: "Tabs", href: "/tabs", icon: Guitar },
  { label: "Setlists", href: "/setlists", icon: ListMusic },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Chat", href: "/chat", icon: MessageCircle },
];

export const settingsNav: NavItem = {
  label: "Band Settings",
  href: "/settings",
  icon: Settings,
};

export const routeTitles: Record<string, string> = {
  "/songs": "Songs",
  "/setlists": "Setlists",
  "/calendar": "Calendar",
  "/tabs": "Tabs",
  "/chat": "Chat",
  "/settings": "Band Settings",
};
