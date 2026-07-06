import { EmptyState } from "@/components/ui/EmptyState";
import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <EmptyState
            icon={AlertTriangle}
            title="Something went wrong"
            description="An unexpected error occurred. Try again or reload the page."
            action={{
              label: "Try again",
              onClick: this.handleRetry,
            }}
          >
            {import.meta.env.DEV && (
              <pre className="mt-6 max-w-lg overflow-x-auto rounded-lg border border-border bg-surface-1 px-4 py-3 text-left font-mono text-xs text-muted">
                {this.state.error.message}
              </pre>
            )}
          </EmptyState>
        </div>
      );
    }

    return this.props.children;
  }
}
