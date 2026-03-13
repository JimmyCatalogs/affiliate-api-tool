import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.PEPPERJAM_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing PEPPERJAM_API_KEY in environment variables' },
      { status: 500 }
    )
  }

  const url = new URL('https://api.pepperjamnetwork.com/20120402/publisher/creative/banner')
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('format', 'json')

  const res = await fetch(url.toString(), { cache: 'no-store' })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `Pepperjam API error ${res.status}: ${text}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  const banners = Array.isArray(data?.data) ? data.data : []
  return NextResponse.json(banners)
}
