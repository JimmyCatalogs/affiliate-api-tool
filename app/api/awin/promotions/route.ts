import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.AWIN_API_TOKEN
  const publisherId = process.env.AWIN_PUBLISHER_ID

  if (!token || !publisherId) {
    return NextResponse.json(
      { error: 'Missing AWIN_API_TOKEN or AWIN_PUBLISHER_ID in environment variables' },
      { status: 500 }
    )
  }

  const res = await fetch(
    `https://api.awin.com/publishers/${publisherId}/promotions`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `Awin API error ${res.status}: ${text}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
