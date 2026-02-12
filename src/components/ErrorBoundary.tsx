import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // This will surface in Lovable console logs.
    console.error("[ErrorBoundary] Uncaught render error", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          The preview failed to render
        </h1>
        <p style={{ marginBottom: 12, opacity: 0.8 }}>
          A runtime error occurred. Open the browser console for details.
        </p>
        <pre
          style={{
            background: "#0b1020",
            color: "#e5e7eb",
            padding: 12,
            borderRadius: 12,
            overflow: "auto",
            maxWidth: "100%",
          }}
        >
          {String(this.state.error?.stack || this.state.error?.message || "Unknown error")}
        </pre>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 14,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "white",
            cursor: "pointer",
          }}
        >
          Reload preview
        </button>
      </div>
    );
  }
}
