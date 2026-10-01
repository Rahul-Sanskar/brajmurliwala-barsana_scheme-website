"use client";

import { PROJECT } from "@/app/_data/project";

/**
 * NoticeBar — institutional scrolling notice ticker.
 * Red background with orange accent dot.
 * Only shows confirmed notices — suppresses [TO BE PROVIDED] placeholders.
 */
export function NoticeBar() {
  const items = PROJECT.notices.filter((n) => !n.includes("[TO BE PROVIDED]"));
  const track = [...items, ...items];

  return (
    <div
      id="updates"
      className="notice-bar"
      role="marquee"
      aria-label="Latest project updates"
    >
      <div className="notice-bar-label">Notice</div>
      <div className="notice-bar-content">
        <span className="notice-rotate-track">
          {track.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mr-12">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-bmu-orange flex-shrink-0"
                aria-hidden="true"
              />
              {item}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
