import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.CJ_API_TOKEN
  const websiteId = process.env.CJ_WEBSITE_ID

  if (!token || !websiteId) {
    return NextResponse.json(
      { error: 'Missing CJ_API_TOKEN or CJ_WEBSITE_ID in environment variables' },
      { status: 500 }
    )
  }

  const url = new URL('https://advertiser-lookup.api.cj.com/v2/advertiser-lookup')
  url.searchParams.set('website-id', websiteId)
  url.searchParams.set('advertiser-ids', 'joined')

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `CJ API error ${res.status}: ${text}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  // CJ returns a bare object (not array) when only one advertiser — normalise to array
  const raw = data?.advertisers?.advertiser ?? []
  const advertisers = Array.isArray(raw) ? raw : [raw]

  return NextResponse.json(advertisers)
}
