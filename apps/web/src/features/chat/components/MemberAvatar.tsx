import { avatarStyleForUser, getInitials } from "@/features/chat/lib/chat-utils";
import { cn } from "@/lib/cn";

export interface MemberAvatarProps {
  userId: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-[11px]",
  md: "h-11 w-11 text-xs",
  lg: "h-14 w-14 text-sm",
};

export function MemberAvatar({
  userId,
  name,
  size = "md",
  className,
}: MemberAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold ring-1",
        avatarStyleForUser(userId),
        sizeStyles[size],
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
