import { cn } from "@/lib/cn";
import { tabSectionId } from "@/lib/tab-layout";

export interface TabSectionNavProps {
  sections: string[];
  activeSection: string | null;
  onSelect: (section: string) => void;
  className?: string;
}

export function TabSectionNav({
  sections,
  activeSection,
  onSelect,
  className,
}: TabSectionNavProps) {
  if (sections.length <= 1) return null;

  return (
    <div
      className={cn(
        "shrink-0 border-b border-border-subtle bg-surface-2/40 px-1 pb-2",
        className,
      )}
    >
      <div className="flex gap-1 overflow-x-auto scroll-smooth-touch overscroll-x-contain py-1">
        {sections.map((section) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              type="button"
              onClick={() => onSelect(section)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "bg-accent-subtle text-foreground"
                  : "text-muted hover:bg-surface-3 hover:text-foreground",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {section}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { tabSectionId };
