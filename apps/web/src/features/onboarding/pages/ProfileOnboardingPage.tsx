import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { useSession } from "@/hooks/useSession";
import { roleLabels } from "@/lib/roles";
import { updateProfileRequest } from "@/services/api-client";
import type { BandRole } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const PROFILE_ROLES: BandRole[] = [
  "bass",
  "drums",
  "vocals",
  "lead_guitar",
  "rhythm_guitar",
  "custom",
];

export function ProfileOnboardingPage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const { session, refreshSession } = useSession();
  const [primaryRole, setPrimaryRole] = useState<BandRole>(
    session?.user.primaryRole ?? "bass",
  );
  const [customRoleLabel, setCustomRoleLabel] = useState(
    session?.user.customRoleLabel ?? "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName =
    clerkUser?.fullName?.trim() ||
    session?.user.name ||
    clerkUser?.primaryEmailAddress?.emailAddress ||
    "Band member";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (primaryRole === "custom" && !customRoleLabel.trim()) {
      setError("Describe your role when using a custom instrument.");
      return;
    }

    setSubmitting(true);

    try {
      await updateProfileRequest(
        {
          primaryRole,
          customRoleLabel:
            primaryRole === "custom" ? customRoleLabel.trim() : undefined,
        },
        getToken,
      );
      await refreshSession();
      navigate("/onboarding/band", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not save profile",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Set up your profile"
      description="Tell the band what you play. You can refine this later in settings."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Name" htmlFor="profile-name">
          <Input
            id="profile-name"
            value={displayName}
            readOnly
            disabled
            className="opacity-80"
          />
        </FormField>

        <FormField label="Email" htmlFor="profile-email">
          <Input
            id="profile-email"
            value={session?.user.email ?? ""}
            readOnly
            disabled
            className="opacity-80"
          />
        </FormField>

        <FormField label="Primary instrument / role" htmlFor="profile-role">
          <NativeSelect
            id="profile-role"
            value={primaryRole}
            onChange={(event) =>
              setPrimaryRole(event.target.value as BandRole)
            }
            disabled={submitting}
          >
            {PROFILE_ROLES.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        {primaryRole === "custom" && (
          <FormField label="Custom role" htmlFor="profile-custom-role">
            <Input
              id="profile-custom-role"
              placeholder="Keys, sax, producer…"
              value={customRoleLabel}
              onChange={(event) => setCustomRoleLabel(event.target.value)}
              disabled={submitting}
            />
          </FormField>
        )}

        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Saving profile…" : "Continue"}
        </Button>
      </form>
    </AuthShell>
  );
}
