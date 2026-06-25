import { DetailBackLink } from "@/components/shared/DetailBackLink";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { MemberAvatar } from "@/features/chat/components/MemberAvatar";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import {
  resolveMemberProfile,
  useMemberProfileQuery,
} from "@/hooks/useMemberProfileQuery";
import { buildMemberProfilePlaceholder } from "@/lib/member-profile-placeholder";
import { formatDate } from "@/lib/format";
import { getMemberLabel, roleLabels } from "@/lib/roles";
import { useClerk } from "@clerk/clerk-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function MemberProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { openUserProfile } = useClerk();
  const { activeBand } = useActiveBand();
  const { members, users, currentUser } = useBandWorkspace();

  const member = userId
    ? members.find((item) => item.userId === userId)
    : undefined;

  const workspacePlaceholder = useMemo(
    () =>
      userId
        ? buildMemberProfilePlaceholder(
            userId,
            members,
            users,
            currentUser.id,
          )
        : undefined,
    [currentUser.id, members, userId, users],
  );

  const profileQuery = useMemberProfileQuery(userId);

  const profile = resolveMemberProfile(
    profileQuery.data,
    workspacePlaceholder,
  );

  const partsLoading =
    profileQuery.isFetching &&
    Boolean(userId) &&
    (profile?.parts.length ?? 0) === 0;

  if (!userId || !member) {
    return (
      <div className="px-6 py-5">
        <DetailBackLink to="/settings" label="Back to settings" />
        <p className="mt-6 text-sm text-muted">Member not found in this band.</p>
      </div>
    );
  }

  const { name, role } = getMemberLabel(member, users);
  const displayProfile = profile ?? {
    member,
    user: users.find((user) => user.id === userId) ?? { id: userId, name },
    isSelf: userId === currentUser.id,
    parts: [],
  };

  return (
    <div>
      <PageHeader />
      <div className="space-y-6 px-6 py-5">
        <DetailBackLink to="/settings" label="Back to settings" />

        {profileQuery.error && (
          <p className="text-sm text-danger" role="alert">
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "Failed to load profile"}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <MemberAvatar userId={userId} name={name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <p className="mt-1 text-sm text-muted">{role}</p>
            <p className="mt-2 text-sm text-subtle">
              Joined {formatDate(member.joinedAt)}
            </p>

            {displayProfile.isSelf && displayProfile.user.email && (
              <p className="mt-2 text-sm text-muted">{displayProfile.user.email}</p>
            )}

            {displayProfile.isSelf && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openUserProfile()}
                >
                  Manage account
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/settings")}
                >
                  Band settings
                </Button>
              </div>
            )}
          </div>
        </div>

        {displayProfile.isSelf && (
          <Card>
            <CardHeader>
              <CardTitle>Band role</CardTitle>
              <CardDescription>
                Your role in {activeBand?.name ?? "this band"} is{" "}
                <span className="text-foreground">
                  {roleLabels[member.role] ?? member.role}
                </span>
                . Role changes after joining will be handled by band admins in a
                future update.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <section>
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Instrument parts in this band
          </h3>
          {partsLoading ? (
            <p className="text-sm text-muted">Loading parts…</p>
          ) : displayProfile.parts.length === 0 ? (
            <p className="text-sm text-muted">
              {member.role === "custom"
                ? "No standard instrument parts are linked to a custom role."
                : "No parts written yet for this instrument."}
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {displayProfile.parts.map((part) => (
                <li key={part.tabId}>
                  <Link
                    to={`/songs/${part.songId}`}
                    className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-surface-2"
                  >
                    <span className="font-medium text-foreground">
                      {part.songTitle}
                    </span>
                    <span className="text-xs text-subtle capitalize">
                      {part.instrument.replace("_", " ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
