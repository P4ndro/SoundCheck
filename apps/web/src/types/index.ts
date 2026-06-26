export type SongStatus =
  | "not_started"
  | "in_progress"
  | "instrumental_ready"
  | "completed";

export type BandRole =
  | "bass"
  | "drums"
  | "vocals"
  | "lead_guitar"
  | "rhythm_guitar"
  | "custom";

export type Instrument =
  | "bass"
  | "drums"
  | "vocals"
  | "lead_guitar"
  | "rhythm_guitar";

export type EventType = "rehearsal" | "gig" | "meeting";

export interface User {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  primaryRole?: BandRole;
  customRoleLabel?: string;
}

export type OnboardingStep = "profile" | "band" | "complete";

export interface OnboardingState {
  profileComplete: boolean;
  hasBand: boolean;
  nextStep: OnboardingStep;
}

export interface Band {
  id: string;
  name: string;
  createdAt: string;
}

export interface BandMember {
  id: string;
  userId: string;
  bandId: string;
  role: BandRole;
  customRoleLabel?: string;
  joinedAt: string;
  user?: User;
}

export interface MemberPart {
  tabId: string;
  songId: string;
  songTitle: string;
  instrument: Instrument;
}

export interface MemberProfile {
  member: BandMember;
  user: User;
  isSelf: boolean;
  parts: MemberPart[];
}

export interface Song {
  id: string;
  bandId: string;
  title: string;
  bpm: number | null;
  timeSignature: string;
  durationSeconds: number;
  status: SongStatus;
  key: string;
  tuning: string;
  lyrics: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstrumentTab {
  id: string;
  songId: string;
  instrument: Instrument;
  asciiTab: string;
  chordChart: string;
  capo?: number | null;
  trackName?: string;
}

export interface Setlist {
  id: string;
  bandId: string;
  name: string;
  description: string;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BandEvent {
  id: string;
  bandId: string;
  title: string;
  type: EventType;
  start: string;
  end: string;
  location: string;
  notes: string;
  setlistId?: string;
}

export type ChatMessageType = "text" | "image";

export interface ChatMessage {
  id: string;
  bandId: string;
  senderId: string;
  type: ChatMessageType;
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
  createdAt: string;
}

export interface BandWorkspace {
  currentUser: User;
  band: Band;
  members: BandMember[];
  users: User[];
  songs: Song[];
  tabs: InstrumentTab[];
  setlists: Setlist[];
  events: BandEvent[];
}
