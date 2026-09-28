import { ImageResponse } from "next/og";
import { MONOGRAM } from "@/components/Monogram";
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
        background: "#f6f2ea",
        color: "#111515",
      }}
    >
      <svg width="160" height="120" viewBox={MONOGRAM.viewBox} fill="#111515">
        {MONOGRAM.order.map((k) => (
          <path
            key={k}
            d={MONOGRAM.shapes[k as keyof typeof MONOGRAM.shapes]}
          />
        ))}
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 30, letterSpacing: 4 }}>BHAKTI AHIR</div>
        <div
          style={{
            fontSize: 108,
            letterSpacing: -3,
            lineHeight: 1,
            marginTop: 16,
          }}
        >
          I build ways forward.
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
