import { ImageResponse } from "next/og"

export const alt = "ViralShort — AI Faceless Video Generator"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #09090b 0%, #18181b 55%, #1e1b4b 100%)",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "9999px",
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "4px solid #3f3f46",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "26px solid transparent",
                borderBottom: "26px solid transparent",
                borderLeft: "42px solid #ffffff",
                marginLeft: "10px",
              }}
            />
          </div>
          <div style={{ fontSize: "44px", fontWeight: 700 }}>ViralShort</div>
        </div>

        <div
          style={{
            marginTop: "48px",
            fontSize: "76px",
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: "900px",
          }}
        >
          AI Faceless Video Generator
        </div>

        <div
          style={{
            marginTop: "32px",
            fontSize: "34px",
            color: "#a1a1aa",
            maxWidth: "920px",
          }}
        >
          Create viral shorts from scripts or AskReddit threads — voiceover,
          subtitles and cinematic backgrounds in minutes.
        </div>
      </div>
    ),
    { ...size }
  )
}
