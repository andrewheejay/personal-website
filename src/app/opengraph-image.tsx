import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Andrew Heejay Lee'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadInter(weight: 400 | 600) {
  const res = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&display=swap`
  )
  const css = await res.text()
  const match = css.match(/src: url\(([^)]+)\) format\('(woff2|truetype)'\)/)
  if (!match) throw new Error('font src not found')
  const fontRes = await fetch(match[1])
  return fontRes.arrayBuffer()
}

export default async function Image() {
  const [regular, semibold] = await Promise.all([
    loadInter(400),
    loadInter(600),
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
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          andrew heejay lee
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            fontWeight: 400,
            color: 'rgba(244,241,235,0.5)',
          }}
        >
          building machine learning systems on solid ground
        </div>
        <div
          style={{
            marginTop: 64,
            fontSize: 22,
            fontWeight: 400,
            color: 'rgba(244,241,235,0.35)',
            letterSpacing: '0.04em',
            fontFamily: 'monospace',
          }}
        >
          andrewheejay.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
      ],
    }
  )
}
