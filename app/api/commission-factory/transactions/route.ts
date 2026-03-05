import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.COMMISSION_FACTORY_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing COMMISSION_FACTORY_API_KEY in environment variables' },
      { status: 500 }
    )
  }

  const toDate = new Date().toISOString().split('T')[0]

  const res = await fetch(
    `https://api.commissionfactory.com/V1/Affiliate/Transactions?apiKey=${encodeURIComponent(apiKey)}&fromDate=2000-01-01&toDate=${toDate}`,
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
