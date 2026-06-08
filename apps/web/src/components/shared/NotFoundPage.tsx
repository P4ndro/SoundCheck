import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

export interface NotFoundPageProps {
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
}

export function NotFoundPage({
  title,
  description,
  backHref,
  backLabel,
}: NotFoundPageProps) {
  return (
    <EmptyState icon={FileQuestion} title={title} description={description}>
      <Link to={backHref} className="mt-6">
        <Button variant="secondary">{backLabel}</Button>
      </Link>
    </EmptyState>
  );
}
