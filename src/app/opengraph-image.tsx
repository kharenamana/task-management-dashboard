import { ImageResponse } from "next/og";

export const alt = "TaskFlow — full-stack task dashboard case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        color: "#191525",
        background:
          "radial-gradient(circle at 15% 15%,#ddd6fe 0,transparent 32%),radial-gradient(circle at 85% 80%,#fed7aa 0,transparent 30%),#fffaf5",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            color: "white",
            fontSize: 46,
            fontWeight: 900,
            background: "linear-gradient(135deg,#7c3aed,#d946ef,#fb923c)",
          }}
        >
          T
        </div>
        <span style={{ fontSize: 38, fontWeight: 900 }}>TaskFlow</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <span style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 900 }}>
          A task dashboard engineered beyond the happy path.
        </span>
        <span style={{ marginTop: 30, fontSize: 28, color: "#5f576d" }}>
          Next.js · Supabase RLS · Strict TypeScript · Accessible UX
        </span>
      </div>
    </div>,
    size,
  );
}
