import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const escapeHtml = (s: string) => s.replace(/</g, "&lt;");

const mountFatal = (message: string, error?: unknown) => {
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  const details =
    error instanceof Error
      ? `${error.message}\n\n${error.stack ?? ""}`
      : typeof error === "string"
        ? error
        : JSON.stringify(error, null, 2);

  rootEl.innerHTML = `
    <div style="padding:24px;font-family:ui-sans-serif,system-ui">
      <h1 style="font-size:18px;font-weight:700;margin-bottom:8px">Preview failed to load</h1>
      <p style="margin-bottom:12px;opacity:0.8">${message}</p>
      <pre style="background:#0b1020;color:#e5e7eb;padding:12px;border-radius:12px;overflow:auto;max-width:100%">${escapeHtml(details || "Unknown error")}</pre>
      <button onclick="window.location.reload()" style="margin-top:14px;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);background:white;cursor:pointer">Reload preview</button>
    </div>
  `;
};

window.addEventListener("error", (e) => {
  console.error("[global] window.error", e.error || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[global] unhandledrejection", e.reason);
});

console.info("[boot] app starting", { at: new Date().toISOString() });

(async () => {
  try {
    const mod = await import("./App.tsx");
    const App = mod.default;

    const rootEl = document.getElementById("root");
    if (!rootEl) throw new Error("Missing #root element");

    // Mark as mounted so index.html watchdog doesn't show "Preview failed to start"
    (window as any).__APP_MOUNTED__ = true;

    createRoot(rootEl).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("[boot] fatal", err);
    mountFatal("A startup error occurred while loading the app bundle.", err);
  }
})();
