import { DetailBackLink } from "@/components/shared/DetailBackLink";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { Textarea } from "@/components/ui/Textarea";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useBandWorkspace, useCurrentMemberRole } from "@/hooks/useBandWorkspace";
import { useSongTabsQuery } from "@/hooks/useSongTabsQuery";
import { queryKeys } from "@/lib/query-keys";
import { roleLabels, roleToInstrument } from "@/lib/roles";
import {
  createTabRequest,
  updateTabRequest,
} from "@/services/api-client";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft, FileMusic } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ASCII_HINT = `Intro
G|----------------|
D|----7---7---7---|
A|----------------|
E|----------------|`;

const CHORD_HINT = `Intro: Am
Verse: Am  F  C  G
Chorus: F  G  Am  C`;

type EditorPanel = "ascii" | "chords";

export function TabEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { activeBand } = useActiveBand();
  const { songs } = useBandWorkspace();
  const memberRole = useCurrentMemberRole();
  const instrument = roleToInstrument(memberRole ?? "custom");

  const initialSongId =
    searchParams.get("songId") ?? songs[0]?.id ?? "";

  const [songId, setSongId] = useState(initialSongId);
  const [asciiTab, setAsciiTab] = useState("");
  const [chordChart, setChordChart] = useState("");
  const [capo, setCapo] = useState("");
  const [trackName, setTrackName] = useState("");
  const [editorPanel, setEditorPanel] = useState<EditorPanel>("ascii");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bandId = activeBand?.id;
  const tabsQuery = useSongTabsQuery(bandId, songId || undefined);

  const existingTab = useMemo(() => {
    if (!instrument) return undefined;
    return tabsQuery.data?.tabs.find((tab) => tab.instrument === instrument);
  }, [tabsQuery.data?.tabs, instrument]);

  const isEditing = Boolean(existingTab);

  useEffect(() => {
    const paramSongId = searchParams.get("songId");
    if (paramSongId) {
      setSongId(paramSongId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!existingTab) {
      setAsciiTab("");
      setChordChart("");
      setCapo("");
      setTrackName("");
      return;
    }

    setAsciiTab(existingTab.asciiTab);
    setChordChart(existingTab.chordChart);
    setCapo(
      existingTab.capo != null && existingTab.capo > 0
        ? String(existingTab.capo)
        : "",
    );
    setTrackName(existingTab.trackName ?? "");
  }, [existingTab?.id, songId]);

  if (!instrument) {
    return (
      <div className="px-6 py-5">
        <DetailBackLink to="/tabs" label="Tabs" currentTitle="Edit notation" />
        <p className="mt-6 text-sm text-muted">
          Custom band roles cannot edit instrument notation yet.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!bandId || !songId) return;

    const trimmedAscii = asciiTab.trim();
    const trimmedChords = chordChart.trim();

    if (!trimmedAscii && !trimmedChords) {
      setError("Add ASCII tab text, a chord chart, or both.");
      return;
    }

    const capoValue = capo.trim() === "" ? null : Number(capo);
    if (capoValue != null && (Number.isNaN(capoValue) || capoValue < 0 || capoValue > 24)) {
      setError("Capo must be between 0 and 24.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      asciiTab,
      chordChart,
      capo: capoValue,
      trackName: trackName.trim() || undefined,
    };

    try {
      if (existingTab) {
        await updateTabRequest(
          bandId,
          songId,
          existingTab.id,
          payload,
          getToken,
        );
        toast("Notation updated", "info");
      } else {
        await createTabRequest(bandId, songId, payload, getToken);
        toast("Notation saved", "info");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.workspace(bandId) }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.tabs(bandId, songId),
        }),
      ]);

      navigate(
        `/tabs?songId=${encodeURIComponent(songId)}&instrument=${encodeURIComponent(instrument)}`,
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save notation",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const instrumentLabel = roleLabels[instrument];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border px-6 py-4">
        <DetailBackLink
          to="/tabs"
          label="Tabs"
          currentTitle={isEditing ? "Edit notation" : "Add notation"}
        />

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-3xl">
            <FormField label="Song" htmlFor="tab-edit-song">
              <NativeSelect
                id="tab-edit-song"
                value={songId}
                onChange={(event) => setSongId(event.target.value)}
                disabled={submitting || tabsQuery.isPending}
              >
                {songs.map((song) => (
                  <option key={song.id} value={song.id}>
                    {song.title}
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField label="Your part" htmlFor="tab-edit-instrument">
              <Input
                id="tab-edit-instrument"
                value={instrumentLabel}
                readOnly
                disabled
                className="opacity-80"
              />
            </FormField>

            <FormField label="Capo" htmlFor="tab-edit-capo" hint="Optional, 0–24">
              <Input
                id="tab-edit-capo"
                type="number"
                min={0}
                max={24}
                value={capo}
                onChange={(event) => setCapo(event.target.value)}
                disabled={submitting}
                placeholder="0"
              />
            </FormField>

            <FormField
              label="Track label"
              htmlFor="tab-edit-track-name"
              hint="Optional display name"
            >
              <Input
                id="tab-edit-track-name"
                value={trackName}
                onChange={(event) => setTrackName(event.target.value)}
                disabled={submitting}
                placeholder="e.g. Lead · distortion"
                maxLength={50}
              />
            </FormField>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/tabs")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={submitting}>
              {submitting ? "Saving…" : isEditing ? "Save changes" : "Save part"}
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3 lg:hidden">
          <ViewToggle
            value={editorPanel}
            onChange={setEditorPanel}
            options={[
              { value: "ascii", label: "ASCII tab", icon: FileMusic },
              { value: "chords", label: "Chord chart", icon: AlignLeft },
            ]}
          />
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          <NotationField
            id="tab-edit-ascii"
            label="ASCII tab"
            hint={ASCII_HINT}
            value={asciiTab}
            onChange={setAsciiTab}
            disabled={submitting}
            className={editorPanel === "chords" ? "hidden lg:flex" : "flex"}
          />

          <NotationField
            id="tab-edit-chords"
            label="Chord chart"
            hint={CHORD_HINT}
            value={chordChart}
            onChange={setChordChart}
            disabled={submitting}
            className={editorPanel === "ascii" ? "hidden lg:flex" : "flex"}
          />
        </div>
      </div>
    </div>
  );
}

function NotationField({
  id,
  label,
  hint,
  value,
  onChange,
  disabled,
  className,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`min-h-0 flex-col ${className ?? "flex"}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        spellCheck={false}
        className="min-h-[280px] flex-1 resize-none font-mono text-[13px] leading-relaxed lg:min-h-0"
        maxLength={50_000}
      />
      <p className="mt-2 text-xs text-subtle">
        Paste plain text from Ultimate Guitar, Songsterr, or write by hand. Max
        50,000 characters.
      </p>
      <pre className="mt-2 overflow-x-auto rounded-md border border-border-subtle bg-surface-1 px-3 py-2 font-mono text-[11px] leading-relaxed text-muted">
        {hint}
      </pre>
    </div>
  );
}
