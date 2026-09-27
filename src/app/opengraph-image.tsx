import { ImageResponse } from "next/og";
import {
  MONOGRAM_JUNCTION,
  MONOGRAM_ORDER,
  MONOGRAM_PATHS,
  MONOGRAM_VIEWBOX,
} from "@/components/Monogram";
import { SITE } from "@/lib/projects";

export const alt = "Bhakti Ahir — Technology should expand what people can do.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f3efe7",
        color: "#111515",
      }}
    >
      <svg
        width="120"
        height="101"
        viewBox={MONOGRAM_VIEWBOX}
        fill="none"
        stroke="#111515"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MONOGRAM_ORDER.map((v) => (
          <path key={v} d={MONOGRAM_PATHS[v]} />
        ))}
        <circle
          cx={MONOGRAM_JUNCTION.x}
          cy={MONOGRAM_JUNCTION.y}
          r="3.2"
          fill="#f3efe7"
          strokeWidth="2"
        />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 112, letterSpacing: -3, lineHeight: 1 }}>
          BHAKTI AHIR
        </div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#595f5b" }}>
          {SITE.philosophy}
        </div>
        <div style={{ fontSize: 24, marginTop: 36, letterSpacing: 4 }}>
          DECIDE · LEARN · CONNECT · ACT
        </div>
      </div>
    </div>,
    size,
  );
}
