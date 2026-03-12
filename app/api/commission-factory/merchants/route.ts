import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const apiKey = process.env.COMMISSION_FACTORY_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing COMMISSION_FACTORY_API_KEY in environment variables' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const statusParam = status ? `&status=${encodeURIComponent(status)}` : ''

  const res = await fetch(
    `https://api.commissionfactory.com/V1/Affiliate/Merchants?apiKey=${encodeURIComponent(apiKey)}${statusParam}`,
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
