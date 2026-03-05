import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.COMMISSION_FACTORY_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing COMMISSION_FACTORY_API_KEY in environment variables' },
      { status: 500 }
    )
  }

  const { id } = await params

  const res = await fetch(
    `https://api.commissionfactory.com/V1/Affiliate/DataFeeds/${encodeURIComponent(id)}?apiKey=${encodeURIComponent(apiKey)}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `Commission Factory API error ${res.status}: ${text}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
