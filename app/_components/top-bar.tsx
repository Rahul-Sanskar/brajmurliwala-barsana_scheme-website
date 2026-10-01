/**
 * TopBar — thin utility bar rendered on desktop only.
 * Part of the layout.tsx chrome; sits above the Header.
 * Uses red/orange institutional palette.
 * Header component renders its own utility bar — this file is kept
 * for backward-compatibility but returns null (Header handles it).
 */
export function TopBar() {
  // The header.tsx now renders the full top utility bar inline.
  // This component is kept as an empty export to avoid import errors.
  return null;
}
