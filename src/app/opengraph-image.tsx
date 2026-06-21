import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0B0C0C",
          color: "#F4F1EB",
          padding: 90,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontFamily: "sans-serif" }}>
            andrew heejay lee
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              fontFamily: "monospace",
              color: "#F4F1EB",
              opacity: 0.7,
              letterSpacing: 1,
            }}
          >
            building machine learning systems on solid ground
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 22,
              fontFamily: "monospace",
              color: "#F4F1EB",
              opacity: 0.45,
              letterSpacing: 1,
            }}
          >
            andrewheejaylee.com
          </div>
        </div>
        <svg width="260" height="260" viewBox="0 0 100 100">
          <polygon
            points="48,5 72,22 90,50 82,75 62,92 38,95 12,80 8,50 22,18"
            fill="#1E1F1D"
          />
          <polygon points="48,5 22,18 8,50 30,70 45,60" fill="#4A4A45" />
          <polygon points="48,5 72,22 90,50 60,55" fill="#2E2E2A" />
          <polygon points="48,5 32,12 40,35" fill="#D8D2C2" />
          <polygon points="60,55 90,50 82,75 62,92" fill="#060606" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
