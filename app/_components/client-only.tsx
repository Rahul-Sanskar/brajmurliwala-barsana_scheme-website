"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * ClientOnly — renders children only after client hydration.
 *
 * Why this exists:
 * Browser password-manager extensions (LastPass, Dashlane, 1Password, etc.)
 * inject `fdprocessedid` attributes into <button> and <input> elements
 * BEFORE React hydrates. This creates a server/client HTML mismatch that
 * React logs as a hydration error.
 *
 * suppressHydrationWarning on <html>/<body> only suppresses the mismatch
 * on that one element — not descendants. Wrapping interactive sections in
 * ClientOnly means the server renders `fallback` (a matching skeleton),
 * the client renders the real component after mount, and React never sees
 * a mismatch because the DOM was never diffed against a server tree that
 * lacked the injected attributes.
 *
 * Usage:
 *   <ClientOnly fallback={<div className="h-24" />}>
 *     <SomeInteractiveComponent />
 *   </ClientOnly>
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : <>{fallback}</>;
}
