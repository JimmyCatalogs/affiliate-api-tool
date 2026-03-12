import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const sid = process.env.IMPACT_ACCOUNT_SID
  const token = process.env.IMPACT_AUTH_TOKEN

  if (!sid || !token) {
    return NextResponse.json(
      { error: 'Missing IMPACT_ACCOUNT_SID or IMPACT_AUTH_TOKEN in environment variables' },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const campaignId = searchParams.get('CampaignId')
  const url = new URL(`https://api.impact.com/Mediapartners/${sid}/Ads`)
  if (campaignId) url.searchParams.set('CampaignId', campaignId)

  const credentials = Buffer.from(`${sid}:${token}`).toString('base64')

  const res = await fetch(url.toString(),
    {
      headers: { Authorization: `Basic ${credentials}`, Accept: 'application/json' },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `Impact API error ${res.status}: ${text}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
