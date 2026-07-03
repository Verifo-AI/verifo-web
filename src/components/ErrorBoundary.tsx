import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

// Without this, ANY uncaught error thrown while rendering ANYWHERE in the
// app (a bad wallet adapter, a bad API response shape, etc.) unmounts the
// entire React tree and leaves the user staring at a blank white page with
// no way to tell what happened. This catches it, keeps the rest of the site
// intact, and shows the real error so it can actually be diagnosed and fixed
// instead of guessed at.
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error in render tree:", error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-8 text-center space-y-4">
          <h1 className="text-xl font-bold text-foreground">Something broke on this page</h1>
          <p className="text-sm text-muted-foreground">
            This didn't take down the whole site, just this page. Here's exactly what happened:
          </p>
          <pre className="text-left text-xs bg-muted text-muted-foreground rounded-lg p-4 overflow-auto max-h-64 whitespace-pre-wrap">
            {error.name}: {error.message}
            {error.stack ? `\n\n${error.stack}` : ""}
          </pre>
          <button
            onClick={this.handleReset}
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }
}
