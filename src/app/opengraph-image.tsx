import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'andrew heejay lee'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Requested without a modern UA, Google Fonts serves TrueType rather than
// woff2, which is what Satori can actually parse.
async function loadFont(family: string, weight: number) {
  const res = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`
  )
  const css = await res.text()
  const match = css.match(/src: url\(([^)]+)\) format\('(woff2|truetype)'\)/)
  if (!match) throw new Error(`font src not found for ${family} ${weight}`)
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}

export default async function Image() {
  const [sansRegular, mono] = await Promise.all([
    loadFont('Inter', 400),
    loadFont('IBM+Plex+Mono', 400),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0B0C0C',
          color: '#F4F1EB',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 110px',
          fontFamily: 'Inter',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 400,
            letterSpacing: '-0.02em',
          }}
        >
          andrew heejay lee
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            fontWeight: 400,
            color: 'rgba(244,241,235,0.6)',
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          the projects, and where they fall short
        </div>
        <div
          style={{
            marginTop: 64,
            fontSize: 22,
            fontWeight: 400,
            color: 'rgba(244,241,235,0.4)',
            letterSpacing: '0.06em',
            fontFamily: 'IBM Plex Mono',
          }}
        >
          andrewheejay.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: sansRegular, weight: 400, style: 'normal' },
        { name: 'IBM Plex Mono', data: mono, weight: 400, style: 'normal' },
      ],
    }
  )
}
