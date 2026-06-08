import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { InviteMemberModal } from "@/features/band/components/InviteMemberModal";
import { formatDate } from "@/lib/format";
import { getMemberLabel } from "@/lib/roles";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import type { BandMember } from "@/types";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

export function SettingsPage() {
  const { band, members, users, updateBandName } = useBandWorkspace();
  const [bandName, setBandName] = useState(band.name);
  const [inviteOpen, setInviteOpen] = useState(false);

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Member",
        cell: (member: BandMember) => {
          const { name, role } = getMemberLabel(member, users);
          return (
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-subtle">{role}</p>
            </div>
          );
        },
      },
      {
        key: "joined",
        header: "Joined",
        cell: (member: BandMember) => (
          <span className="text-muted">{formatDate(member.joinedAt)}</span>
        ),
        className: "w-36",
      },
    ],
    [users],
  );

  return (
    <div>
      <PageHeader
        description="Manage your band, members, and instrument edit permissions."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-5">
        <Card>
          <CardHeader>
            <CardTitle>Band info</CardTitle>
            <CardDescription>
              Basic details visible to all members.
            </CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="band-name"
                className="mb-1.5 block text-xs font-medium text-muted"
              >
                Band name
              </label>
              <Input
                id="band-name"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => updateBandName(bandName)}
              disabled={bandName.trim() === "" || bandName === band.name}
            >
              Save
            </Button>
          </div>
          <p className="mt-3 text-xs text-subtle">
            Created {formatDate(band.createdAt)}
          </p>
        </Card>

        <section>
          <h3 className="mb-3 text-sm font-medium text-foreground">Members</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <DataTable
              columns={columns}
              data={members}
              keyExtractor={(member) => member.id}
            />
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Edit permissions</CardTitle>
            <CardDescription>
              Each member can edit only their own instrument parts. Band leads
              can override — coming in a later phase.
            </CardDescription>
          </CardHeader>
          <ul className="space-y-2 text-sm text-muted">
            <li>· Bass parts — editable by bassist only</li>
            <li>· Drum parts — editable by drummer only</li>
            <li>· Guitar parts — editable by assigned guitarist only</li>
            <li>· Lyrics and song metadata — all members can view</li>
          </ul>
        </Card>
      </div>

      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
}
